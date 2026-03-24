import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { StartupGig } from "../types";

export const StartupCard = ({ gig }: { gig: StartupGig }) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold">{gig.title}</CardTitle>
          <Badge variant="outline" className="text-blue-600">{gig.founder_name}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Skills Section */}
        <div className="flex flex-wrap gap-2">
          {gig.required_skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="text-[10px]">
              {skill}
            </Badge>
          ))}
        </div>

        {/* Matching Score Section */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-medium">
            <span>Matching Score</span>
            <span className={gig.match_score && gig.match_score > 70 ? "text-green-600" : "text-blue-600"}>
              {gig.match_score}%
            </span>
          </div>
          <Progress value={gig.match_score} className="h-1.5" />
        </div>

        <div className="flex justify-between items-center pt-2">
          <span className="text-sm font-semibold text-gray-700">{gig.budget}</span>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            One-Click Apply
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};