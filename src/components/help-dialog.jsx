import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";

export default function HelpDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                    <InfoIcon className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>K-Map Simplification Guide</DialogTitle>
                    <DialogDescription>
                        Learn how to use the Karnaugh Map simplification tool
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Boolean Expression Format</h3>
                        <p>Enter expressions using these conventions:</p>
                        <ul className="list-disc list-inside pl-4 space-y-1">
                            <li>
                                <code>A'</code> or <code>Ā</code> - NOT A (complement)
                            </li>
                            <li>
                                <code>AB</code> - A AND B (product)
                            </li>
                            <li>
                                <code>A+B</code> - A OR B (sum)
                            </li>
                            <li>
                                Example: <code>A'B + BC'</code>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2">K-Map Manipulation</h3>
                        <ul className="list-disc list-inside pl-4 space-y-1">
                            <li>Click on cells to toggle between 0, 1, and X (don't care)</li>
                            <li>The tool automatically identifies optimal groupings</li>
                            <li>Groups must contain 1, 2, 4, 8, or 16 cells (powers of 2)</li>
                            <li>Cells with "X" can be treated as either 0 or 1 to optimize grouping</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2">Reading the K-Map</h3>
                        <p>
                            The K-map is arranged in Gray code order, which ensures that adjacent cells differ
                            by only one variable. This property makes it easier to identify groups.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2">Simplification Rules</h3>
                        <ul className="list-disc list-inside pl-4 space-y-1">
                            <li>Each group eliminates one variable from the expression</li>
                            <li>Larger groups result in simpler expressions</li>
                            <li>Groups can be overlapped, and redundant groups are ignored</li>
                            <li>Try to cover all 1s with the fewest and largest possible groups</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2">Examples</h3>
                        <p>
                            <strong>Example 1:</strong> For a 3-variable K-map (A, B, C) with 1s in cells 1,
                            3, 5, 7, the simplified expression would be: B
                        </p>
                        <p>
                            <strong>Example 2:</strong> For a 4-variable K-map with 1s in adjacent corners
                            (which are adjacent in K-map), they can be grouped to eliminate variables.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
