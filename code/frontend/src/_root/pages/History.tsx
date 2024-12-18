import React, { useState, useEffect } from 'react';
import { Client, Databases, Query } from 'appwrite';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, FileText, Calendar, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserContext } from '@/context/AuthContext';

interface HistoryItem {
  $id: string;
  $createdAt: string;
  image_url: string;
  patient_history: {
    name: string;
    email: string;
    imageUrl: string;
  };
}

const History: React.FC = () => {
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
const { user } = useUserContext();
  useEffect(() => {
    const client = new Client()
      .setEndpoint('https://cloud.appwrite.io/v1')
      .setProject('66cbc2bc0002c3f33c3c');

    const databases = new Databases(client);

    const fetchHistoryData = async () => {
      try {
        const response = await databases.listDocuments(
          '66cbca4e003e3e5d6e7c',
          '66cbcb30002d5b8f52a2',
          [
            Query.equal('patient_history', user.id.toString())  // Use the image_id field from your JSON
        ]
         
        );
        setHistoryData(response.documents as HistoryItem[]);
      } catch (error) {
        console.error('Error fetching history data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Document History</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {historyData.map((item) => (
          <Card key={item.$id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2" />
                Document {item.$id.slice(0, 8)}...
              </CardTitle>
              <CardDescription>
                <div className="flex items-center">
                  <Calendar className="mr-2" />
                  Created: {new Date(item.$createdAt).toLocaleDateString()}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex items-center mb-4">
                <Avatar className="h-10 w-10 mr-2">
                  <AvatarImage src={item.patient_history.imageUrl} alt={item.patient_history.name} />
                  <AvatarFallback>{item.patient_history.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{item.patient_history.name}</p>
                  <p className="text-sm text-muted-foreground">{item.patient_history.email}</p>
                </div>
              </div>
            </CardContent>
            <div className="p-4 bg-muted mt-auto">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open(item.image_url, '_blank')}
              >
                View Document
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default History;