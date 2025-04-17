/**
 * K-Map Logic Utilities
 * This file contains functions for K-map manipulation and simplification
 */

// Parse a boolean expression in SOP (Sum of Products) form
export function parseSOP(expression, variables) {
    // Clean the expression
    const cleanExpr = expression.replace(/\s/g, "");
    if (!cleanExpr) return null;

    // Initialize truth table
    const size = Math.pow(2, variables);
    const kMapValues = Array(size).fill(0);

    try {
        // Process each minterm in the Sum of Products form
        const terms = cleanExpr.split("+");

        terms.forEach((term) => {
            // Determine which cells this term affects
            let affectedCells = [];

            // Start with all cells
            for (let i = 0; i < size; i++) {
                affectedCells.push(i);
            }

            // Filter cells based on term variables
            let idx = 0;
            while (idx < term.length) {
                let varName = term[idx];
                let isComplement = false;

                // Check for complement
                if (idx + 1 < term.length && term[idx + 1] === "'") {
                    isComplement = true;
                    idx++;
                }

                // Find variable position (A=0, B=1, etc.)
                const varPos = varName.charCodeAt(0) - "A".charCodeAt(0);
                if (varPos < 0 || varPos >= variables) {
                    throw new Error(`Invalid variable: ${varName}`);
                }

                // Filter cells based on this variable
                affectedCells = affectedCells.filter((cell) => {
                    const binary = cell.toString(2).padStart(variables, "0");
                    const bitValue = binary[varPos] === "1";
                    return isComplement ? !bitValue : bitValue;
                });

                idx++;
            }

            // Set the affected cells to 1
            affectedCells.forEach((cell) => {
                kMapValues[cell] = 1;
            });
        });

        return kMapValues;
    } catch (error) {
        console.error("Error parsing SOP expression:", error);
        return null;
    }
}

// Parse a boolean expression in POS (Product of Sums) form
export function parsePOS(expression, variables) {
    // Clean the expression
    const cleanExpr = expression.replace(/\s/g, "");
    if (!cleanExpr) return null;

    // Initialize truth table (all 1s by default for POS)
    const size = Math.pow(2, variables);
    const kMapValues = Array(size).fill(1);

    try {
        // Check if expression is wrapped in parentheses
        if (cleanExpr[0] !== "(" || cleanExpr[cleanExpr.length - 1] !== ")") {
            throw new Error("POS expressions should be wrapped in parentheses: (A+B)(B+C)");
        }

        // Remove outer parentheses
        const innerExpr = cleanExpr.substring(1, cleanExpr.length - 1);

        // Split by close-open parentheses to get individual sums
        const sums = innerExpr.split(")(");

        sums.forEach((sum) => {
            // Remove any remaining parentheses
            sum = sum.replace(/[\(\)]/g, "");

            // Determine which cells this sum affects (cells to be set to 0)
            let affectedCells = [];

            // Start with all cells
            for (let i = 0; i < size; i++) {
                affectedCells.push(i);
            }

            // Split by '+' to get individual variables
            const literals = sum.split("+");

            // For each literal, filter the affected cells
            literals.forEach((literal) => {
                let varName = literal[0];
                let isComplement = literal.length > 1 && literal[1] === "'";

                // Find variable position (A=0, B=1, etc.)
                const varPos = varName.charCodeAt(0) - "A".charCodeAt(0);
                if (varPos < 0 || varPos >= variables) {
                    throw new Error(`Invalid variable: ${varName}`);
                }

                // Filter cells based on this variable
                affectedCells = affectedCells.filter((cell) => {
                    const binary = cell.toString(2).padStart(variables, "0");
                    const bitValue = binary[varPos] === "1";
                    return isComplement ? !bitValue : bitValue;
                });
            });

            // Set the affected cells to 0 (since in POS, we're looking for cells that make the expression false)
            affectedCells.forEach((cell) => {
                kMapValues[cell] = 0;
            });
        });

        return kMapValues;
    } catch (error) {
        console.error("Error parsing POS expression:", error);
        return null;
    }
}

// Find all possible K-map groupings
export function findGroupings(kMapValues, variables, isSOPMode) {
    const size = kMapValues.length;
    const groups = [];
    const rows = 4; // Always 4 rows for 4-variable K-map
    const cols = 4; // Always 4 columns for 4-variable K-map

    // Check for group sizes (powers of 2)
    const groupSizes = [16, 8, 4, 2, 1].filter((s) => s <= size);

    // Helper to check if a cell should be included in a group
    const shouldInclude = (index) => {
        // For SOP mode, include 1s and Xs; for POS mode, include 0s and Xs
        return isSOPMode
            ? kMapValues[index] === 1 || kMapValues[index] === "X"
            : kMapValues[index] === 0 || kMapValues[index] === "X";
    };

    // Helper to convert row,col to index using Gray code
    const toIndex = (row, col) => {
        // We need Gray code conversion for proper K-map adjacency
        const grayRow = toGrayCode(row, Math.log2(rows));
        const grayCol = toGrayCode(col, Math.log2(cols));
        return grayRow * cols + grayCol;
    };

    // Helper to convert number to Gray code
    const toGrayCode = (num, bits) => {
        const gray = num ^ (num >> 1);
        return gray & ((1 << bits) - 1);
    };

    // Check for groups of each size
    for (const groupSize of groupSizes) {
        // Find dimensions of this group size
        // All groups must be rectangular with sides that are powers of 2
        const possibleDimensions = [];
        for (let i = 0; i <= Math.log2(groupSize); i++) {
            const rowSize = 1 << i;
            const colSize = groupSize / rowSize;
            if (colSize <= cols && rowSize <= rows) {
                possibleDimensions.push({ rows: rowSize, cols: colSize });
            }
        }

        // Check each possible position and dimension
        for (const dim of possibleDimensions) {
            for (let startRow = 0; startRow <= rows - dim.rows; startRow++) {
                for (let startCol = 0; startCol <= cols - dim.cols; startCol++) {
                    // Special case for K-map wrapping - check if this would wrap around
                    // We need to handle groups that wrap around the edges
                    const dimensions = [
                        {
                            // No wrapping
                            startRow,
                            startCol,
                            rowWrap: false,
                            colWrap: false,
                        },
                        {
                            // Column wrapping if it fits
                            startRow,
                            startCol: cols - dim.cols,
                            rowWrap: false,
                            colWrap: true,
                        },
                        {
                            // Row wrapping if it fits
                            startRow: rows - dim.rows,
                            startCol,
                            rowWrap: true,
                            colWrap: false,
                        },
                        {
                            // Both row and column wrapping if it fits
                            startRow: rows - dim.rows,
                            startCol: cols - dim.cols,
                            rowWrap: true,
                            colWrap: true,
                        },
                    ];

                    // Check each possible wrapping configuration
                    dimensions.forEach((config) => {
                        if (
                            (config.rowWrap && startRow + dim.rows > rows) ||
                            (config.colWrap && startCol + dim.cols > cols)
                        ) {
                            // Skip this configuration if it doesn't fit with wrapping
                            return;
                        }

                        // Check if all cells in this group match our inclusion criteria
                        let allMatch = true;
                        const cellsInGroup = [];

                        for (let r = 0; r < dim.rows; r++) {
                            for (let c = 0; c < dim.cols; c++) {
                                const row = (config.startRow + r) % rows; // Wrap around for K-map adjacency
                                const col = (config.startCol + c) % cols;
                                const index = toIndex(row, col);

                                if (!shouldInclude(index)) {
                                    allMatch = false;
                                    break;
                                }
                                cellsInGroup.push(index);
                            }
                            if (!allMatch) break;
                        }

                        if (allMatch && cellsInGroup.length > 0) {
                            // At least one cell must not be a don't care
                            const valueToCheck = isSOPMode ? 1 : 0;

                            if (cellsInGroup.some((idx) => kMapValues[idx] === valueToCheck)) {
                                groups.push({
                                    cells: cellsInGroup,
                                    size: groupSize,
                                    color: `hsl(${(groups.length * 30) % 360}, 70%, 50%)`,
                                });
                            }
                        }
                    });
                }
            }
        }
    }

    // Filter redundant groups - keep essential prime implicants
    const essentialGroups = [];
    const coveredCells = new Set();

    // Find all cells with value 1 (for SOP) or 0 (for POS)
    const targetCells = [];
    const valueToCheck = isSOPMode ? 1 : 0;

    for (let i = 0; i < size; i++) {
        if (kMapValues[i] === valueToCheck) {
            targetCells.push(i);
        }
    }

    // Sort groups by size (largest first)
    groups.sort((a, b) => b.size - a.size);

    // Add groups that cover new cells
    groups.forEach((group) => {
        const newCells = group.cells.filter(
            (cell) => kMapValues[cell] === valueToCheck && !coveredCells.has(cell)
        );

        if (newCells.length > 0) {
            essentialGroups.push(group);
            group.cells.forEach((cell) => {
                if (kMapValues[cell] === valueToCheck) {
                    coveredCells.add(cell);
                }
            });
        }
    });

    return essentialGroups;
}

// Generate simplified Boolean expression from groupings
export function generateExpression(groupings, variables, isSOPMode) {
    if (!groupings || groupings.length === 0) {
        return isSOPMode ? "0" : "1"; // Empty SOP = 0, Empty POS = 1
    }

    // Generate variable names A, B, C, etc.
    const varNames = Array(variables)
        .fill(0)
        .map((_, i) => String.fromCharCode(65 + i));

    // Generate term for each group
    const terms = groupings.map((group) => {
        // Find which variables are essential for this group
        // A variable is essential if it doesn't change within the group
        const essentialVars = Array(variables).fill(null);

        // Check the first cell to initialize
        const firstCell = group.cells[0];
        const firstBinary = firstCell.toString(2).padStart(variables, "0");

        for (let v = 0; v < variables; v++) {
            essentialVars[v] = firstBinary[v] === "1";
        }

        // Check all other cells
        for (let c = 1; c < group.cells.length; c++) {
            const cell = group.cells[c];
            const binary = cell.toString(2).padStart(variables, "0");

            for (let v = 0; v < variables; v++) {
                const bitValue = binary[v] === "1";
                // If any cell has a different value, this variable is not essential
                if (bitValue !== essentialVars[v]) {
                    essentialVars[v] = null;
                }
            }
        }

        // Generate term based on essential variables
        let term = "";

        if (isSOPMode) {
            // SOP: Product term (AND of literals)
            for (let v = 0; v < variables; v++) {
                if (essentialVars[v] !== null) {
                    term += essentialVars[v] ? varNames[v] : `${varNames[v]}'`;
                }
            }

            // If no essential variables, this group covers all possibilities
            if (term === "") {
                return "1";
            }
        } else {
            // POS: Sum term (OR of literals)
            const literals = [];

            for (let v = 0; v < variables; v++) {
                if (essentialVars[v] !== null) {
                    // In POS, we complement the values from the K-map
                    literals.push(essentialVars[v] ? `${varNames[v]}'` : varNames[v]);
                }
            }

            // If no essential variables, this group covers all possibilities
            if (literals.length === 0) {
                return "0";
            }

            term = "(" + literals.join("+") + ")";
        }

        return term;
    });

    // Join terms with + for SOP, or implicitly AND for POS
    return isSOPMode ? terms.join(" + ") : terms.join("");
}

// Full process: parse, find groupings, simplify
export function simplifyExpression(expression, variables, isSOPMode) {
    // Parse the expression based on mode
    const kMapValues = isSOPMode ? parseSOP(expression, variables) : parsePOS(expression, variables);

    if (!kMapValues) return { error: "Invalid expression" };

    // Find groupings
    const groupings = findGroupings(kMapValues, variables, isSOPMode);

    // Generate simplified expression
    const simplified = generateExpression(groupings, variables, isSOPMode);

    return {
        kMapValues,
        groupings,
        simplified,
    };
}

// Update K-map with simplified logic based on values
export function simplifyKMap(kMapValues, variables, isSOPMode) {
    // Find groupings
    const groupings = findGroupings(kMapValues, variables, isSOPMode);

    // Generate simplified expression
    const simplified = generateExpression(groupings, variables, isSOPMode);

    return {
        groupings,
        simplified,
    };
}

// Parse expression (either SOP or POS)
export function parseExpression(expression, variables, isSOPMode) {
    return isSOPMode ? parseSOP(expression, variables) : parsePOS(expression, variables);
}
