import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function SimplifiedResult({ expression, groupings, expressionMode }) {
    if (!expression) {
        return (
            <div className="text-center py-4 text-muted-foreground">
                Enter an expression or create groupings on the K-map to see results
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-3">Simplified Expression</h3>
                <Card className="p-4 flex items-center justify-center bg-muted/30">
                    <p className="text-xl font-mono">{expression}</p>
                </Card>
            </div>

            {groupings.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-3">Groupings</h3>
                    <div className="flex flex-wrap gap-2">
                        {groupings.map((group, index) => (
                            <Badge
                                key={index}
                                style={{ backgroundColor: group.color }}
                                className="text-white"
                            >
                                Group {index + 1} ({group.cells.length} cell
                                {group.cells.length !== 1 ? "s" : ""})
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            <div>
                <h3 className="text-lg font-semibold mb-3">How to Read K-Map Results</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Each grouping represents a term in the simplified expression</li>
                    <li>Larger groups result in simpler terms</li>
                    <li>Groups must contain 1, 2, 4, 8, or 16 cells (powers of 2)</li>
                    <li>
                        {expressionMode === "sop"
                            ? "The final expression is the sum (OR) of all grouped terms"
                            : "The final expression is the product (AND) of all grouped terms"}
                    </li>
                    <li>
                        {expressionMode === "sop"
                            ? "In SOP form, we group 1s to minimize the expression"
                            : "In POS form, we group 0s to minimize the expression"}
                    </li>
                </ul>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-3">
                    {expressionMode === "sop" ? "SOP Explanation" : "POS Explanation"}
                </h3>
                <p className="text-sm text-muted-foreground">
                    {expressionMode === "sop"
                        ? "Sum of Products (SOP) represents the function as an OR of AND terms. Each group forms a product term, and these terms are summed together."
                        : "Product of Sums (POS) represents the function as an AND of OR terms. Each group forms a sum term, and these terms are multiplied together."}
                </p>
            </div>
        </div>
    );
}
