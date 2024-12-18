import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { appwriteConfig, databases } from '@/lib/appwrite/config'
import { ID } from 'appwrite'
import { useUserContext } from '@/context/AuthContext'
import { deleteFile, getFilePreview, uploadFile } from '@/lib/appwrite/api'

interface AnalysisResult {
  detailed_analysis: string;
  analysis_report: string;
  recommendations: string;
  treatment_options: string;
  disclaimer: string;
}

export default function MedicalImage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const {user}  = useUserContext()
  useEffect(() => {
    if (selectedImage) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(selectedImage)
    } else {
      setImagePreview(null)
    }
  }, [selectedImage])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0])
      setResult(null) // Clear previous results when a new image is selected
    }
  }


  const saveInteractionHistory = async ( imageUrl: URL, imageId: string) => {
    try {
        console.log("Inside History")
        const newInteraction = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.historyCollectionId,
            ID.unique(),
            {
                doctor_history: user.id,
                patient_history: user.id,
                image_url: imageUrl,
                image_id: imageId,
            }
        )

        if (!newInteraction) {
            throw new Error("Failed to create interaction history")
        }

        return newInteraction
    } catch (error) {
        console.error("Error saving interaction history:", error)
        throw error
    }
}



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedImage) return

    setIsLoading(true)
    setResult(null)

    const formData = new FormData()
    formData.append('file', selectedImage)

    try {
      const response = await fetch('http://0.0.0.0:8000/doc/image-analsis', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      setResult(data)
     //saving data in history
     const uploadedFile = await uploadFile(selectedImage);
     const fileUrl = getFilePreview(uploadedFile.$id);
     if (!fileUrl) {
       await deleteFile(uploadedFile.$id);
       throw new Error("Failed to get file preview");
     }
     console.log("About to save history")
     
     await saveInteractionHistory(fileUrl, uploadedFile.$id);


    } catch (error) {
      console.error('Error:', error)
      setResult({
        detailed_analysis: 'Error occurred while processing the image',
        analysis_report: 'Error occurred while processing the image',
        recommendations: '',
        treatment_options: '',
        disclaimer: 'An error occurred. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-start h-full w-full bg-background p-4 overflow-auto scrollbar-hide">
      <div className="w-full max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold text-center text-foreground">Medical Image Analysis</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card p-6 rounded-lg shadow-md">
            <Label htmlFor="image-upload" className="block text-lg font-medium text-foreground mb-4">
              Select an image for analysis
            </Label>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <Button
                type="button"
                onClick={() => document.getElementById('image-upload')?.click()}
                variant="outline"
                className="w-full sm:w-40 h-12 text-black"
              >
                Choose File
              </Button>
              <div className="flex-1 w-full sm:w-auto truncate border rounded-md px-4 py-3 bg-background min-h-[48px] flex items-center justify-center sm:justify-start">
                {selectedImage ? selectedImage.name : 'No file chosen'}
              </div>
            </div>
          </div>
          {imagePreview && (
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Selected Image:</h2>
              <div className="flex justify-center">
                <img 
                  src={imagePreview} 
                  alt="Selected" 
                  className="max-w-full max-h-[300px] object-contain rounded-md"
                />
              </div>
            </div>
          )}
          <Button 
            type="submit" 
            disabled={!selectedImage || isLoading} 
            className="w-full h-12"
          >
            {isLoading ? 'Processing...' : 'Upload and Analyze Image'}
          </Button>
        </form>
        {result && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Medical Analysis Result</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <section>
                <h3 className="text-lg font-semibold mb-2">Analysis Report</h3>
                <p className="text-sm text-muted-foreground">{result.analysis_report}</p>
              </section>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="detailed-analysis">
                  <AccordionTrigger>Detailed Analysis</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm">{result.detailed_analysis}</p>
                  </AccordionContent>
                </AccordionItem>

                {result.recommendations && (
                  <AccordionItem value="recommendations">
                    <AccordionTrigger>Recommendations</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm">{result.recommendations}</p>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {result.treatment_options && (
                  <AccordionItem value="treatment-options">
                    <AccordionTrigger>Treatment Options</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm">{result.treatment_options}</p>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>

              {result.disclaimer && (
                <Alert>
                  <AlertTitle>Disclaimer</AlertTitle>
                  <AlertDescription>{result.disclaimer}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}