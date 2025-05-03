import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define the type for menu items
interface MenuItem {
  name: string;
  price: number;
  description: string;
  badge?: string;
}

export default function CoffeeShopPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[600px] w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 z-10" />
        <div className="absolute inset-0 bg-[url('/coffee-hero.jpg')] bg-cover bg-center" />
        <div className="container mx-auto relative z-20 h-full flex flex-col justify-center items-start px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Bean & Brew
          </h1>
          <p className="text-xl text-white/90 max-w-lg mb-8">
            Artisan coffee and delicious pastries in a cozy atmosphere.
            Experience the perfect blend of flavor and comfort.
          </p>
          <div className="flex gap-4">
            <Button size="lg">View Menu</Button>
            <Button
              variant="outline"
              size="lg"
              className="bg-transparent text-white border-white hover:bg-white/10"
            >
              Book a Table
            </Button>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Coffee Crafted with Passion
              </h2>
              <p className="text-foreground/80 mb-6">
                At Bean & Brew, we believe that great coffee is an art form. Our
                baristas are trained to perfect every cup, using ethically
                sourced beans from around the world. Whether you are a coffee
                connoisseur or just looking for your morning fix, we have got
                something for everyone.
              </p>
              <p className="text-foreground/80 mb-8">
                Our cozy space is designed for comfort - the perfect place to
                work, meet friends, or simply enjoy a moment of peace with a
                delicious brew.
              </p>
              <Button>About Our Story</Button>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-[url('/coffee-pouring.jpg')] bg-cover bg-center rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Menu</h2>

          <Tabs defaultValue="coffee" className="w-full max-w-3xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="coffee">Coffee</TabsTrigger>
              <TabsTrigger value="food">Food</TabsTrigger>
              <TabsTrigger value="desserts">Desserts</TabsTrigger>
            </TabsList>

            <TabsContent value="coffee" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {coffeeItems.map((item, index) => (
                  <MenuCard key={index} {...item} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="food" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {foodItems.map((item, index) => (
                  <MenuCard key={index} {...item} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="desserts" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dessertItems.map((item, index) => (
                  <MenuCard key={index} {...item} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Gallery</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="aspect-square rounded-lg overflow-hidden bg-muted/50"
              >
                <div
                  className={`w-full h-full bg-[url('/coffee-${
                    index + 1
                  }.jpg')] bg-cover bg-center`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-background">
                <CardContent className="pt-6">
                  <div className="flex flex-col space-y-4">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${
                            i < testimonial.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="italic text-foreground/80">
                      &ldquo;{testimonial.text}&rdquo;
                    </p>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-foreground/60">
                        {testimonial.title}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact/Locations */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Visit Us</h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Downtown</h3>
                  <p className="text-foreground/80">123 City Center Ave</p>
                  <p className="text-foreground/80">Mon-Fri: 7am-8pm</p>
                  <p className="text-foreground/80">Sat-Sun: 8am-9pm</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Uptown</h3>
                  <p className="text-foreground/80">456 Park Boulevard</p>
                  <p className="text-foreground/80">Mon-Fri: 6:30am-9pm</p>
                  <p className="text-foreground/80">Sat-Sun: 7am-10pm</p>
                </div>
                <Button>See All Locations</Button>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-[url('/coffee-shop-map.jpg')] bg-cover bg-center rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
          <p className="max-w-lg mx-auto mb-8">
            Subscribe to our newsletter for exclusive offers, events, and coffee
            tips.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email"
              className="px-4 py-2 rounded-md w-full bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <Button variant="secondary">Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
}

// Properly typed MenuCard component
function MenuCard({ name, price, description, badge }: MenuItem) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">{name}</h3>
          <span className="font-medium">${price.toFixed(2)}</span>
        </div>
        <p className="text-sm text-foreground/70 mb-4">{description}</p>
        {badge && (
          <div className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
            {badge}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Menu data
const coffeeItems: MenuItem[] = [
  {
    name: "Espresso",
    price: 3.5,
    description: "Rich and intense single shot of pure coffee essence",
    badge: "Classic",
  },
  {
    name: "Cappuccino",
    price: 4.75,
    description: "Equal parts espresso, steamed milk and silky microfoam",
    badge: "Popular",
  },
  {
    name: "Pour Over",
    price: 5.25,
    description: "Hand-poured single origin coffee with complex flavor notes",
    badge: "Specialty",
  },
  {
    name: "Cold Brew",
    price: 4.95,
    description: "Smooth, low-acid coffee steeped for 18 hours",
  },
];

const foodItems: MenuItem[] = [
  {
    name: "Avocado Toast",
    price: 9.5,
    description:
      "Sourdough bread topped with avocado, cherry tomatoes and microgreens",
    badge: "Vegetarian",
  },
  {
    name: "Breakfast Sandwich",
    price: 8.75,
    description: "Egg, cheddar, and bacon on a toasted artisan roll",
    badge: "Best Seller",
  },
  {
    name: "Quinoa Bowl",
    price: 11.95,
    description: "Roasted vegetables, mixed greens and tahini dressing",
    badge: "Vegan",
  },
  {
    name: "Chicken Panini",
    price: 10.5,
    description:
      "Grilled chicken with pesto, mozzarella and sun-dried tomatoes",
  },
];

const dessertItems: MenuItem[] = [
  {
    name: "Chocolate Croissant",
    price: 4.25,
    description: "Flaky pastry filled with rich dark chocolate",
    badge: "Fresh Daily",
  },
  {
    name: "Carrot Cake",
    price: 6.5,
    description: "Moist cake with walnuts and cream cheese frosting",
  },
  {
    name: "Macarons (3pc)",
    price: 7.95,
    description: "Assorted flavors of delicate French macarons",
    badge: "Seasonal",
  },
  {
    name: "Cheesecake",
    price: 6.95,
    description: "New York style with a graham cracker crust",
  },
];

// Define the type for testimonial items
interface Testimonial {
  name: string;
  title: string;
  rating: number;
  text: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah Johnson",
    title: "Regular Customer",
    rating: 5,
    text: "Bean & Brew has the best lattes in town. The atmosphere is perfect for remote work days.",
  },
  {
    name: "Michael Chen",
    title: "Food Blogger",
    rating: 5,
    text: "Their seasonal menu is always innovative yet approachable. The pastries are absolutely incredible.",
  },
  {
    name: "Emily Rodriguez",
    title: "Local Artist",
    rating: 4,
    text: "Love their commitment to showcasing local art. Great coffee and even better community vibes.",
  },
];
