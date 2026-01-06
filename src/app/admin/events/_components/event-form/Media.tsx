import React from "react";
import { EventFormStepProps } from "./General";
import { Button } from "@nextui-org/react";
import toast from "react-hot-toast/headless";

function Media({
  newlySelectedImages,
  setNewlySelectedImages,
  event,
  activeStep,
  setActiveStep,
  alreadyUploadedImages,
  setAlreadyUploadedImages,
}: EventFormStepProps) {
  const uploadFilesRef = React.useRef<HTMLInputElement>(null);

  const onFileSelect = (e: any) => {
    try {
      const files = e.target.files;
      const filesArray = Array.from(files);

      // set the newly selected images with urls
      const existingNewlySelectedImages = newlySelectedImages || [];
      const newImages = filesArray.map((file: any) => ({
        url: URL.createObjectURL(file),
        file,
      }));
      setNewlySelectedImages([...existingNewlySelectedImages, ...newImages]);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const onNewUploadedRemove = (index: number) => {
    const tempImages: any[] = [...newlySelectedImages];
    tempImages.splice(index, 1);
    setNewlySelectedImages(tempImages);
  };

  const onAlreadyUploadedRemove = (index: number) => {
    const tempImages: string[] = [...alreadyUploadedImages];
    tempImages.splice(index, 1);
    setAlreadyUploadedImages(tempImages);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <p className="text-sm text-blue-700">
          <strong>Professional Tip:</strong> Upload high-quality images showcasing your museum's architecture, exhibitions, and key attractions. First image will be used as the main display image.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Museum Images
          <span className="text-gray-400 font-normal ml-2">(Recommended: 3-10 images)</span>
        </label>
        <Button 
          onClick={() => uploadFilesRef.current?.click()}
          color="primary"
          variant="bordered"
          className="font-medium"
          startContent={<i className="ri-upload-cloud-line"></i>}
        >
          <input
            type="file"
            ref={uploadFilesRef}
            hidden
            onChange={onFileSelect}
            accept="image/*"
            multiple
          />
          Upload Images
        </Button>
        <p className="text-xs text-gray-500 mt-2">
          Supported formats: JPG, PNG, WebP. Maximum file size: 10MB per image.
        </p>
      </div>

      {(alreadyUploadedImages?.length > 0 || newlySelectedImages?.length > 0) && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Uploaded Images ({alreadyUploadedImages?.length || 0 + newlySelectedImages?.length || 0})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {alreadyUploadedImages?.map((image: any, index: number) => (
              <div key={`existing-${index}`} className="relative group border-2 border-gray-200 rounded-lg overflow-hidden hover:border-primary transition-colors">
                <img
                  src={image}
                  alt={`Museum image ${index + 1}`}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                  <Button
                    size="sm"
                    color="danger"
                    variant="flat"
                    onClick={() => onAlreadyUploadedRemove(index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <i className="ri-delete-bin-line mr-1"></i>
                    Remove
                  </Button>
                </div>
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                    Main Image
                  </div>
                )}
              </div>
            ))}
            {newlySelectedImages?.map((image: any, index: number) => (
              <div key={`new-${index}`} className="relative group border-2 border-gray-200 rounded-lg overflow-hidden hover:border-primary transition-colors">
                <img
                  src={image.url}
                  alt={`New museum image ${index + 1}`}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                  <Button
                    size="sm"
                    color="danger"
                    variant="flat"
                    onClick={() => onNewUploadedRemove(index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <i className="ri-delete-bin-line mr-1"></i>
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(!alreadyUploadedImages || alreadyUploadedImages.length === 0) && (!newlySelectedImages || newlySelectedImages.length === 0) && (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <i className="ri-image-line text-4xl text-gray-400 mb-3"></i>
          <p className="text-gray-500 text-sm">No images uploaded yet</p>
          <p className="text-gray-400 text-xs mt-1">Click "Upload Images" to add museum photos</p>
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t">
        <Button 
          variant="light" 
          onClick={() => setActiveStep(activeStep - 1)}
          className="font-medium"
        >
          ← Back
        </Button>
        <Button 
          onClick={() => setActiveStep(activeStep + 1)} 
          color="primary"
          size="lg"
          className="font-semibold px-8"
        >
          Continue to Tickets →
        </Button>
      </div>
    </div>
  );
}

export default Media;