import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <Card className="container mx-auto border-none shadow-none">
      <CardHeader className="py-8">
        <CardTitle className="text-3xl font-bold">About Whitepace</CardTitle>
        <CardDescription className="text-lg">
          Modern collaboration platform for productive teams
        </CardDescription>
      </CardHeader>
      
      <CardContent className="px-4 space-y-8">
        {/* Company Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CardDescription className="text-lg">
              Whitepace is a modern platform for collaboration and productivity.
            </CardDescription>
            <CardDescription className="text-lg">
              Our mission is to provide a seamless experience for teams to work
              together, no matter where they are.
            </CardDescription>
            <CardDescription className="text-lg">
              We believe in the power of collaboration and strive to create tools that
              enhance communication and productivity.
            </CardDescription>
          </CardContent>
        </Card>

        <Separator />
        
        {/* Company Values */}
        <Tabs defaultValue="values" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="values">Our Values</TabsTrigger>
            <TabsTrigger value="team">Our Team</TabsTrigger>
            <TabsTrigger value="story">Our Story</TabsTrigger>
          </TabsList>
          
          <TabsContent value="values" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  We constantly push the boundaries of what is possible in collaborative software,
                  bringing new ideas and solutions to help teams work better together.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Simplicity</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  We believe powerful tools do not need to be complicated. Our focus is on
                  creating intuitive experiences that anyone can use with minimal training.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Trust</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  We build products with security and privacy at the forefront, ensuring
                  your team  data is always protected and handled responsibly.
                </CardDescription>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="team" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Leadership Team</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teamMembers.map((member, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-xl">{member.name}</CardTitle>
                      <CardDescription>{member.role}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{member.bio}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="story" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Our Journey</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="founding">
                    <AccordionTrigger>2018: The Founding</AccordionTrigger>
                    <AccordionContent>
                      Whitepace was founded by a team of developers who were frustrated with 
                      existing collaboration tools. They set out to create something better.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="launch">
                    <AccordionTrigger>2019: Product Launch</AccordionTrigger>
                    <AccordionContent>
                      After a year of development, the first version of Whitepace was launched
                      to enthusiastic early adopters who helped shape the product.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="growth">
                    <AccordionTrigger>2020-Present: Growth & Expansion</AccordionTrigger>
                    <AccordionContent>
                      Since launch, we have grown to over 100,000 users worldwide and continue
                      to expand our features and capabilities based on customer feedback.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Separator />
        
        {/* Contact/CTA Section */}
        <Card className="bg-muted">
          <CardHeader>
            <CardTitle>Join Our Journey</CardTitle>
            <CardDescription>
              We are always looking for talented individuals to join our team
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-start gap-4">
            <Button>View Careers</Button>
            <Button variant="outline">Contact Us</Button>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}

// Sample data
const teamMembers = [
  {
    name: "Alex Johnson",
    role: "CEO & Co-founder",
    bio: "Alex brings over 15 years of experience in software development and product management."
  },
  {
    name: "Maria Rodriguez",
    role: "CTO & Co-founder",
    bio: "Maria is an expert in cloud architecture and leads our technical strategy and implementation."
  },
  {
    name: "David Chen",
    role: "Head of Design",
    bio: "David ensures our products are not just functional, but beautiful and intuitive to use."
  },
  {
    name: "Sarah Patel",
    role: "VP of Customer Success",
    bio: "Sarah works closely with our customers to ensure they get the most out of Whitepace."
  }
];