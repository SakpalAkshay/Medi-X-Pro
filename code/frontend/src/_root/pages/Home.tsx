
// import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FileImage, Pill, FileText } from "lucide-react";
const Home = () => {
  // const { toast } = useToast();

 


  return (
    <div className="flex flex-1">
    <div className="home-container">
      <div className="home-posts">
        <h2 className="h3-bold md:h2-bold text-left w-full">Medical Analysis Hub</h2>
        <ul className="flex flex-col flex-1 gap-9 w-full">
          <li className="flex justify-center w-full">
            <Card className="w-full hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center gap-4">
                <FileImage className="w-12 h-12 text-blue-500" />
                <div>
                  <CardTitle>Medical Image Analysis</CardTitle>
                  <CardDescription>
                    Analyze and interpret medical images with advanced AI
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild className="mt-4">
                  <Link to="/medical-image">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
          </li>
          <li className="flex justify-center w-full">
            <Card className="w-full hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center gap-4">
                <Pill className="w-12 h-12 text-green-500" />
                <div>
                  <CardTitle>Drug Analysis</CardTitle>
                  <CardDescription>
                    Explore drug interactions, efficacy, and side effects
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild className="mt-4">
                  <Link to="/drug-image">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
          </li>
          <li className="flex justify-center w-full">
            <Card className="w-full hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center gap-4">
                <FileText className="w-12 h-12 text-purple-500" />
                <div>
                  <CardTitle>Medical PDF Summarization</CardTitle>
                  <CardDescription>
                    Quickly summarize and extract key information from medical PDFs
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild className="mt-4">
                  <Link to="/summarize-report">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
          </li>
        </ul>
      </div>
    </div>

    
  </div>);
};

export default Home;
