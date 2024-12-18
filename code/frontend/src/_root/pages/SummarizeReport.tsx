import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SummaryResult {
  summarized_text: string;
}

const SummarizeReport: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SummaryResult | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  }, [file]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setResult(null); // Clear previous results when a new file is selected
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      toast({
        title: 'Error',
        description: 'Please select a PDF file.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://0.0.0.0:8000/report-summarize/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to summarize the document');
      }

      const data: SummaryResult = await response.json();
      setResult(data);
      toast({
        title: 'Success',
        description: 'Medical document summarized successfully.',
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to summarize the document. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-background p-4 overflow-auto">
      <div className="w-full max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold text-center text-foreground">Medical Document Summarization</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Medical Document</CardTitle>
              <CardDescription>Select a PDF file for analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Label htmlFor="file-upload" className="block text-lg font-medium text-foreground mb-4">
                  Select a PDF file for summarization
                </Label>
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    onClick={() => document.getElementById('file-upload')?.click()}
                    variant="outline"
                    className="w-full sm:w-40 h-12"
                  >
                    Choose File
                  </Button>
                  <div className="flex-1 w-full sm:w-auto truncate border rounded-md px-4 py-3 bg-background min-h-[48px] flex items-center justify-center sm:justify-start">
                    {file ? file.name : 'No file chosen'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {filePreview && (
            <Card>
              <CardHeader>
                <CardTitle>Selected File</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <FileText size={64} />
                </div>
                <p className="text-center mt-2">{file?.name}</p>
              </CardContent>
            </Card>
          )}
          <Button 
            type="submit" 
            disabled={!file || loading}
            className="w-full h-12"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Summarize Document
              </>
            )}
          </Button>
        </form>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Medical Analysis Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="summary">
                  <AccordionTrigger>Summary</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm">{result.summarized_text}</p>
                  </AccordionContent>
                </AccordionItem>

              </Accordion>

            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SummarizeReport;