import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RefreshCw, Play } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ExpressionInput({
    expression,
    setExpression,
    parseExpression,
    resetKMap,
    expressionMode,
    setExpressionMode,
}) {
    return (
        <div className="space-y-6">
            <Tabs
                defaultValue={expressionMode}
                className="w-full"
                onValueChange={(value) => setExpressionMode(value)}
            >
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="sop">SOP (Sum of Products)</TabsTrigger>
                    <TabsTrigger value="pos">POS (Product of Sums)</TabsTrigger>
                </TabsList>
                <TabsContent value="sop" className="pt-4">
                    <div className="grid gap-2">
                        <Label htmlFor="sop-expression">Boolean Expression (SOP Form)</Label>
                        <Input
                            id="sop-expression"
                            placeholder="Example: AB' + A'BC"
                            value={expressionMode === "sop" ? expression : ""}
                            onChange={(e) => setExpression(e.target.value)}
                        />
                        <p className="text-sm text-muted-foreground">
                            Use ' for NOT, + for OR, and juxtaposition for AND. Example: AB' + A'BC
                        </p>
                    </div>
                </TabsContent>
                <TabsContent value="pos" className="pt-4">
                    <div className="grid gap-2">
                        <Label htmlFor="pos-expression">Boolean Expression (POS Form)</Label>
                        <Input
                            id="pos-expression"
                            placeholder="Example: (A+B')(B+C)(A'+D)"
                            value={expressionMode === "pos" ? expression : ""}
                            onChange={(e) => setExpression(e.target.value)}
                        />
                        <p className="text-sm text-muted-foreground">
                            Use ' for NOT, + for OR, surround terms in parentheses. Example: (A+B')(B+C)(A'+D)
                        </p>
                    </div>
                </TabsContent>
            </Tabs>

            <div className="flex gap-2">
                <Button onClick={parseExpression} className="flex-1">
                    <Play className="mr-2 h-4 w-4" />
                    Apply Expression
                </Button>
                <Button variant="outline" onClick={resetKMap}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset
                </Button>
            </div>
        </div>
    );
}
