import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AnimatedTestimonialsDemo() {
  const testimonials = [
    {
      quote:
        "K-Map is a graphical method used to simplify Boolean algebra expressions without using algebraic theorems. ",
      name: "INTRODUCTION TO KMAP :-",
      designation:
        "Karnaugh Maps transform complex Boolean expressions into simplified logic, making circuit design more efficient and intuitive",
      src: "/home2.jpg",
    },
    {
      quote:
        "Power of Two Grouping:                           Adjacent Cells Grouping :                        Largest Possible Group :                        Overlapping Allowed:                                      No Diagonal Grouping:                          Don't-Care Conditions:",
      name: "LAWS OF KMAP :-",
      designation: "Group to simplify, don’t amplify",
      src: "/nicolas-thomas-3GZi6OpSDcY-unsplash.jpg",
    },
    {
      quote:
        ".Used in traffic light controllers, elevator systems, washing machines, etc.                    .Used to simplify Boolean expressions for creating efficient digital circuits.                     .Helps reduce the number of gates in a circuit, saving cost, power, and space.           .Simplifies logic in CPU instruction sets and control units.",
      name: "APPILACTION OF KMAP IN REAL LIFE :-",
      designation:
        "From traffic lights to microchips — K-Map powers simplicity in design",
      src: "/tom-barrett-m8H0Ppm2IVk-unsplash.jpg",
    },
    {
      quote:
        ".Offers a clear and visual method to reduce Boolean expressions.                                      .Quick simplification for small to medium-sized Boolean expressions.             .Helps design circuits with fewer components, saving space, power, and cost. .Supports simplification for both Sum of Products and Product of Sums.",
      name: " Why K-maps are Preferred :-",
      designation:
        "K-Maps simplify logic visually — cutting through complexity with clarity and precision.",
      src: "/chris-ried-bN5XdU-bap4-unsplash (1).jpg",
    },
    {
      quote:
        " Core Features:                                              ✅ Input minterms manually or using checkboxes.                                                 ✅ Select the number of variables (2 to 6).    ✅ Visualize K-Map with highlighted minterms.                                                     ✅ Generate simplified Boolean expression. ✅ Download the K-Map as an image.",
      name: "INTERACTIVE TOOL  ( KMAP SOLVER ) :-",
      designation:
        "K-Map Solver: Your go-to tool for simplifying Boolean expressions effortlessly.",
      src: "/Untitled design (2).jpg",
    },
  ];
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <Button className="absolute top-4 right-4 z-10">
        <Link href="/tool">Tools</Link>
      </Button>

      <h1 className="absolute top-4 text-pink-800 margin text-7xl">KMAP</h1>
      <Button className="absolute top-4 left-4 z-10">
        <Link href="https://quizizz.com/join?gc=48852580">QUIZ</Link>
      </Button>
      <AnimatedTestimonials testimonials={testimonials} />
    </div>
  );
}
