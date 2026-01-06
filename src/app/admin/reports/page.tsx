import PageTitle from "@/components/PageTitle";
import React from "react";
import EventModel from "@/models/event-model";
import EventsTableForReports from "./_components/reports-for-events";
import { connectDB } from "@/config/dbConfig";

connectDB();

async function ReportsPage() {
  try {
    const events = await EventModel.find({});
    return (
      <div>
        <div className="mb-5">
          <PageTitle title="Reports" showRefresh={true} />
        </div>
        <EventsTableForReports events={JSON.parse(JSON.stringify(events))} />
      </div>
    );
  } catch (error: any) {
    return (
      <div>
        <div className="mb-5">
          <PageTitle title="Reports" showRefresh={true} />
        </div>
        <div className="mt-5 text-center py-10 bg-white rounded-sm border border-gray-200">
          <p className="text-red-500 text-lg font-semibold mb-2">Error loading reports</p>
          <p className="text-gray-500 text-sm">{error.message || "Please check your database connection and try again."}</p>
        </div>
      </div>
    );
  }
}

export default ReportsPage;