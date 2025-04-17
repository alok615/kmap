"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ModeToggle } from "@/components/mode-toggle";
import ExpressionInput from "@/components/expression-input";
import KMap from "@/components/kmap-tool";
import SimplifiedResult from "@/components/simplified-result";
import HelpDialog from "@/components/help-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { parseExpression, simplifyKMap } from "@/lib/kmap-logic";

export default function KMapPage() {
  // Fixed to 4 variables
  const variables = 4;

  const [expression, setExpression] = useState("");
  const [kMapValues, setKMapValues] = useState([]);
  const [groupings, setGroupings] = useState([]);
  const [simplifiedExpression, setSimplifiedExpression] = useState("");
  const [expressionMode, setExpressionMode] = useState("sop");

  // Initialize kMapValues for 4 variables
  useEffect(() => {
    resetKMap();
  }, []);

  const resetKMap = () => {
    const cellCount = Math.pow(2, variables);
    setKMapValues(Array(cellCount).fill(0));
    setGroupings([]);
    setSimplifiedExpression("");
  };

  const handleParseExpression = () => {
    try {
      if (!expression.trim()) {
        toast.error("Expression Required", {
          description: "Please enter a boolean expression",
        });
        return;
      }

      const isSOPMode = expressionMode === "sop";

      // Use our parser from the kmap-logic utility
      const newKMap = parseExpression(expression, variables, isSOPMode);

      if (!newKMap) {
        toast.error("Invalid Expression", {
          description: `Please check your ${
            isSOPMode ? "SOP" : "POS"
          } expression syntax`,
        });
        return;
      }

      setKMapValues(newKMap);

      // Simplify the K-map
      const result = simplifyKMap(newKMap, variables, isSOPMode);
      setGroupings(result.groupings);
      setSimplifiedExpression(result.simplified);

      toast.success("Expression Parsed", {
        description: "K-Map updated with your expression",
      });
    } catch (error) {
      toast.error("Invalid Expression", {
        description:
          error.message || "Please check your boolean expression syntax",
      });
    }
  };

  const updateKMapCell = (index) => {
    const newValues = [...kMapValues];
    if (newValues[index] === 0) newValues[index] = 1;
    else if (newValues[index] === 1) newValues[index] = "X";
    else newValues[index] = 0;

    setKMapValues(newValues);

    // Re-simplify the K-map
    const isSOPMode = expressionMode === "sop";
    const result = simplifyKMap(newValues, variables, isSOPMode);
    setGroupings(result.groupings);
    setSimplifiedExpression(result.simplified);
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <Link href="/">
          <Button variant="outline" size="sm">
            ← Back to Home
          </Button>
        </Link>
        <div className="flex items-center gap-4">
          <HelpDialog />
          <ModeToggle />
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-center">
        K-Map Simplification Tool (4 Variables)
      </h1>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Input Expression</CardTitle>
            <CardDescription>
              Enter your Boolean expression or use the K-map directly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ExpressionInput
              expression={expression}
              setExpression={setExpression}
              parseExpression={handleParseExpression}
              resetKMap={resetKMap}
              expressionMode={expressionMode}
              setExpressionMode={setExpressionMode}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>K-Map</CardTitle>
            <CardDescription>
              Click on cells to toggle between 0, 1, and X (don't care).
              {expressionMode === "sop" ? " Grouping 1s." : " Grouping 0s."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <KMap
              variables={variables}
              values={kMapValues}
              updateCell={updateKMapCell}
              groupings={groupings}
            />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Simplified Result</CardTitle>
          <CardDescription>
            The minimal Boolean expression in{" "}
            {expressionMode === "sop" ? "SOP" : "POS"} form
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SimplifiedResult
            expression={simplifiedExpression}
            groupings={groupings}
            expressionMode={expressionMode}
          />
        </CardContent>
      </Card>
    </div>
  );
}
