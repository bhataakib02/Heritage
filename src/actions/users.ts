import { connectDB } from "@/config/dbConfig";
import UserModel from "@/models/user-model";
import { currentUser } from "@clerk/nextjs/server";
import { extractId } from "@/lib/db/helpers";

connectDB();

// Helper function to fix existing users with null usernames
const fixNullUsernames = async () => {
    try {
        // Find users with null, undefined, or empty usernames
        const usersWithNullUsername = await UserModel.find({
            $or: [
                { userName: null },
                { userName: "" }
            ]
        }, { limit: 100 }); // Limit to prevent too many operations
        
        if (usersWithNullUsername.length === 0) {
            return; // No users to fix
        }
        
        console.log(`Fixing ${usersWithNullUsername.length} users with null usernames...`);
        
        for (const user of usersWithNullUsername) {
            try {
                let newUserName = "";
                if (user.email) {
                    newUserName = user.email.split("@")[0];
                } else if (user.clerkUserId) {
                    newUserName = `user_${user.clerkUserId.slice(0, 8)}`;
                } else {
                    // Use id field (Supabase uses 'id', not '_id')
                    const userId = (user as any).id || (user as any)._id;
                    newUserName = `user_${String(userId).slice(-8)}`;
                }
                
                // Ensure uniqueness with timestamp and random string
                const timestamp = Date.now();
                const randomStr = Math.random().toString(36).substring(2, 8);
                let finalUserName = `${newUserName}_${timestamp}_${randomStr}`;
                
                // Double check it doesn't exist
                let counter = 1;
                while (await UserModel.findOne({ userName: finalUserName })) {
                    finalUserName = `${newUserName}_${timestamp}_${counter}_${randomStr}`;
                    counter++;
                    if (counter > 100) break; // Safety limit
                }
                
                // Update user with new username
                await UserModel.findByIdAndUpdate(
                    (user as any).id || (user as any)._id,
                    { userName: finalUserName }
                );
            } catch (userError) {
                const userId = (user as any).id || (user as any)._id;
                console.error(`Error fixing user ${userId}:`, userError);
                // Continue with next user
            }
        }
    } catch (error) {
        console.error("Error in fixNullUsernames:", error);
        // Don't throw - this is a cleanup function
    }
};

export const handleNewUserRegistration = async () => {
    let loggedInUser;
    
    try {
        loggedInUser = await currentUser();

        if (!loggedInUser) {
            throw new Error("User not authenticated");
        }

        // Fix any existing users with null usernames (one-time cleanup)
        // This helps resolve conflicts with existing data
        await fixNullUsernames();

        // Generate a unique userName - combine firstName and lastName, or use email as fallback
        let baseUserName = "";
        if (loggedInUser.firstName && loggedInUser.lastName) {
            baseUserName = `${loggedInUser.firstName} ${loggedInUser.lastName}`.trim();
        } else if (loggedInUser.firstName) {
            baseUserName = loggedInUser.firstName.trim();
        } else if (loggedInUser.lastName) {
            baseUserName = loggedInUser.lastName.trim();
        }
        
        // If we still don't have a base name, use email or clerkUserId
        if (!baseUserName) {
            const email = loggedInUser.emailAddresses[0]?.emailAddress;
            baseUserName = email ? email.split("@")[0] : `user_${loggedInUser.id.slice(0, 8)}`;
        }

        // Ensure baseUserName is never empty or null
        if (!baseUserName || baseUserName.trim() === "") {
            baseUserName = `user_${loggedInUser.id.slice(0, 12)}`;
        }

        // Generate a unique userName by checking if it exists and appending a unique suffix if needed
        // Use timestamp as part of the suffix to ensure uniqueness
        let finalUserName = baseUserName;
        let counter = 1;
        const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
        
        // First try with timestamp to ensure uniqueness
        finalUserName = `${baseUserName}_${timestamp}`;
        while (await UserModel.findOne({ userName: finalUserName })) {
            finalUserName = `${baseUserName}_${timestamp}_${counter}`;
            counter++;
            // Safety limit to prevent infinite loop
            if (counter > 1000) {
                finalUserName = `${baseUserName}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
                break;
            }
        }

        // Final validation - ensure userName is never null, undefined, or empty
        if (!finalUserName || finalUserName.trim() === "" || finalUserName === null) {
            finalUserName = `user_${loggedInUser.id}_${Date.now()}`;
        }
        
        // Sanitize username - remove any invalid characters and ensure it's a valid string
        finalUserName = String(finalUserName).trim();
        if (finalUserName === "" || finalUserName === "null" || finalUserName === "undefined") {
            finalUserName = `user_${loggedInUser.id}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        }

        // Use findOneAndUpdate with upsert for atomic operation and better race condition handling
        const email = loggedInUser.emailAddresses[0]?.emailAddress;
        if (!email) {
            throw new Error("User email is required");
        }

        // Check if user already exists
        let existingUser = await UserModel.findOne({ clerkUserId: loggedInUser.id });
        
        if (existingUser) {
            // Update existing user
            const updatedUser = await UserModel.findOneAndUpdate(
                { clerkUserId: loggedInUser.id },
                {
                    userName: finalUserName,
                    email: email,
                    clerkUserId: loggedInUser.id,
                }
            );
            return updatedUser || existingUser;
        } else {
            // Create new user
            const newUser = await UserModel.create({
                userName: finalUserName,
                email: email,
                clerkUserId: loggedInUser.id,
                isActive: true,
                isAdmin: false,
            });
            return newUser;
        }
    } catch (error: any) {
        // Handle duplicate key error - might be from existing null usernames or duplicate usernames
        if (error.code === 11000) {
            // Try to get loggedInUser if not already available
            if (!loggedInUser) {
                try {
                    loggedInUser = await currentUser();
                } catch (authError) {
                    console.error("Could not get logged in user in error handler:", authError);
                    throw error; // Re-throw original error
                }
            }
            
            if (!loggedInUser) {
                throw error; // Re-throw if we still don't have a user
            }
            // Check if user already exists by clerkUserId (might have been created in a race condition)
            const existingUser = await UserModel.findOne({
                clerkUserId: loggedInUser.id,
            });
            if (existingUser) {
                // User exists - if it has a null username, update it
                if (!existingUser.userName || existingUser.userName === null) {
                    const email = loggedInUser.emailAddresses[0]?.emailAddress;
                    let newUserName = "";
                    if (loggedInUser.firstName && loggedInUser.lastName) {
                        newUserName = `${loggedInUser.firstName} ${loggedInUser.lastName}`.trim();
                    } else if (loggedInUser.firstName) {
                        newUserName = loggedInUser.firstName.trim();
                    } else if (loggedInUser.lastName) {
                        newUserName = loggedInUser.lastName.trim();
                    }
                    
                    if (!newUserName) {
                        newUserName = email ? email.split("@")[0] : `user_${loggedInUser.id.slice(0, 8)}`;
                    }
                    
                    // Ensure uniqueness
                    let finalUserName = `${newUserName}_${Date.now()}`;
                    let counter = 1;
                    while (await UserModel.findOne({ userName: finalUserName })) {
                        finalUserName = `${newUserName}_${Date.now()}_${counter}`;
                        counter++;
                    }
                    
                    // Update existing user
                    await UserModel.findOneAndUpdate(
                        { clerkUserId: loggedInUser.id },
                        { userName: finalUserName }
                    );
                }
                return existingUser;
            }
            
            // If it's a username duplicate error, try with a more unique username using findOneAndUpdate
            if (error.keyPattern?.userName || error.message?.includes("username")) {
                const email = loggedInUser.emailAddresses[0]?.emailAddress;
                if (!email) {
                    throw new Error("User email is required");
                }
                
                const baseUserName = email ? email.split("@")[0] : `user_${loggedInUser.id.slice(0, 8)}`;
                const uniqueUserName = `${baseUserName}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
                
                try {
                    // Check if user exists
                    const existingUser = await UserModel.findOne({ clerkUserId: loggedInUser.id });
                    if (existingUser) {
                        // Update existing
                        const updated = await UserModel.findOneAndUpdate(
                            { clerkUserId: loggedInUser.id },
                            { userName: uniqueUserName, email: email }
                        );
                        return updated || existingUser;
                    } else {
                        // Create new
                        const newUser = await UserModel.create({
                            userName: uniqueUserName,
                            email: email,
                            clerkUserId: loggedInUser.id,
                            isActive: true,
                            isAdmin: false,
                        });
                        return newUser;
                    }
                } catch (retryError: any) {
                    // If still failing, try to find existing user one more time
                    const finalUser = await UserModel.findOne({ clerkUserId: loggedInUser.id });
                    if (finalUser) {
                        return finalUser;
                    }
                    console.error("Failed to create user after retry:", retryError);
                    throw retryError;
                }
            }
        }
        
        // Re-throw the error if we couldn't handle it
        console.error("Error in handleNewUserRegistration:", error);
        throw error;
    }
};

export const getUserIdOfLoggedInUser = async () => {
    try {
        const loggedInUser = await currentUser();
        const userInDb = await UserModel.findOne({
            clerkUserId: loggedInUser?.id,
        });
        if (userInDb) {
            // Extract ID (Supabase uses 'id' field)
            return extractId(userInDb);
        }
    } catch (error: any) {
        throw new Error(error);
    }
};

// Backward compatibility alias (deprecated - use getUserIdOfLoggedInUser instead)
export const getMongoDBUserIDOfLoggedInUser = getUserIdOfLoggedInUser;