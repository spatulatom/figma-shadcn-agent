import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="w-full md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Get More Done with{" "}
                <span className="text-primary">Whitepace</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Project management software that enables your teams to
                collaborate, plan, analyze and manage everyday tasks
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg">Try Whitepace free</Button>
                <Button variant="outline" size="lg">
                  View Demo
                </Button>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <div className="relative w-full aspect-video">
                <Image
                  src="/vercel.svg"
                  alt="Whitepace Dashboard"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powerful features to help you manage all your work in one place
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-primary text-xl font-bold">
                      {index + 1}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How Whitepace Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our simple step-by-step process makes it easy to get started
            </p>
          </div>

          <Tabs defaultValue="step1" className="w-full max-w-4xl mx-auto">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="step1">Step 1</TabsTrigger>
              <TabsTrigger value="step2">Step 2</TabsTrigger>
              <TabsTrigger value="step3">Step 3</TabsTrigger>
            </TabsList>
            {steps.map((step, index) => (
              <TabsContent key={index} value={`step${index + 1}`}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Customers Say
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Trusted by thousands of companies worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="italic">
                    {testimonial.quote}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section (using Accordion) */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find answers to commonly asked questions about Whitepace
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl md:text-4xl font-bold">
                Ready to get started with Whitepace?
              </CardTitle>
              <CardDescription className="text-primary-foreground/90 text-lg max-w-2xl mx-auto">
                Start your free trial today and experience the power of
                Whitepace
              </CardDescription>
            </CardHeader>
            <CardFooter className="justify-center flex-col sm:flex-row gap-4 pt-6">
              <Button size="lg" variant="secondary">
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
              >
                Contact Sales
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

   
    </div>
  );
}

// Sample data
const features = [
  {
    title: "Project Management",
    description:
      "Create, assign, and track projects and tasks with ease to stay organized and meet deadlines.",
  },
  {
    title: "Team Collaboration",
    description:
      "Work together with your team in real-time on documents, spreadsheets, and presentations.",
  },
  {
    title: "Analytics & Reporting",
    description:
      "Get insights into your team's performance with detailed analytics and customizable reports.",
  },
];

const steps = [
  {
    title: "Sign Up",
    description:
      "Create your account in seconds and get started with a free 14-day trial.",
  },
  {
    title: "Set Up Your Workspace",
    description:
      "Customize your workspace to fit your team's unique needs and preferences.",
  },
  {
    title: "Invite Your Team",
    description:
      "Add team members and start collaborating on projects right away.",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Product Manager at TechCorp",
    quote:
      "Whitepace has transformed how our team works together. We're more productive than ever!",
  },
  {
    name: "Michael Chen",
    role: "CEO at StartupX",
    quote:
      "As a startup, we needed a solution that could grow with us. Whitepace was perfect for our needs.",
  },
  {
    name: "Emily Rodriguez",
    role: "Marketing Director at GrowthLabs",
    quote:
      "The analytics features in Whitepace have helped us make data-driven decisions for our marketing campaigns.",
  },
];

// Added FAQ section data
const faqs = [
  {
    question: "What is Whitepace?",
    answer:
      "Whitepace is a comprehensive project management platform designed to help teams collaborate effectively, organize tasks, and track progress in one centralized location.",
  },
  {
    question: "How much does Whitepace cost?",
    answer:
      "Whitepace offers flexible pricing plans starting from $12 per user per month. We also offer a free 14-day trial so you can experience all features before committing.",
  },
  {
    question: "Can I use Whitepace on mobile devices?",
    answer:
      "Yes! Whitepace is available on iOS and Android devices, allowing you to manage your projects on the go.",
  },
  {
    question: "Is my data secure with Whitepace?",
    answer:
      "Security is our top priority. Whitepace uses enterprise-grade encryption and follows industry best practices to ensure your data remains secure and private.",
  },
];
