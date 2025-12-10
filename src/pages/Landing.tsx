import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Users,
  TrendingUp,
  Star,
  Zap,
  Brain,
  Rocket,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Footer from "@/components/Footer";
import { useAuthContext } from "@/context/authContext";
import { useEffect, useState } from "react";
import { serverUrl } from "@/lib/api";

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [activeStatIndex, setActiveStatIndex] = useState(0);
  const [team, setTeam] = useState([]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch(`${serverUrl}/team`);
        const data = await response.json();
        setTeam(data);
      } catch (error) {
        console.error("Error fetching team:", error);
      }
    };
    fetchTeam();
  }, []);

  const reviews = [
    {
      name: "John Smith",
      text: "This platform transformed how I learn. The AI tutor adapts to my pace perfectly!",
      rating: 5,
    },
    {
      name: "Emily Johnson",
      text: "Best learning experience ever. The personalized approach makes all the difference.",
      rating: 5,
    },
    {
      name: "Michael Lee",
      text: "I went from beginner to confident in just weeks. Highly recommended!",
      rating: 5,
    },
  ];

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description:
        "Adaptive algorithms that understand your unique learning style and pace",
      gradient: "from-purple-500/20 to-violet-500/20",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Get instant feedback and progress through courses at your own speed",
      gradient: "from-violet-500/20 to-purple-500/20",
    },
    {
      icon: Rocket,
      title: "Career Growth",
      description:
        "Build skills that matter and accelerate your professional journey",
      gradient: "from-purple-600/20 to-violet-600/20",
    },
  ];

  const stats = [
    { value: "10K+", label: "Active Learners", icon: Users },
    { value: "500+", label: "Expert Courses", icon: BookOpen },
    { value: "98%", label: "Success Rate", icon: TrendingUp },
  ];

  // Rotate active stat every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStatIndex((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Hero Section - Modern Bento Style */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="space-y-8 animate-fade-in-up">
              {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium text-secondary">
                  AI-Powered Education Platform
                </span>
              </div> */}

              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight">
                Learn
                <br />
                <span className="text-gradient inline-block">Smarter</span>
                <br />
                Together
              </h1>

              <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
                Experience the future of education with AI-powered
                personalization. Master any skill with intelligent guidance
                tailored just for you.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() =>
                    user ? navigate("/dashboard") : navigate("/login")
                  }
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg px-8 py-6 rounded-2xl group"
                >
                  Start Learning Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-purple-600 border-2 border-background flex items-center justify-center text-white text-xs font-bold"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <div className="font-semibold">Join 10,000+ learners</div>
                  <div className="text-muted-foreground">
                    Trusted by students worldwide
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Bento Grid */}
            <div className="grid grid-cols-2 gap-4 animate-fade-in-up delay-200">
              {/* Large Featured Card */}
              <Card className="col-span-2 bg-gradient-to-br from-secondary/10 via-secondary/5 to-transparent border-secondary/20 backdrop-blur-sm overflow-hidden group hover:border-secondary/40 transition-all">
                <CardContent className="p-8 relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                  {/* <Sparkles className="w-12 h-12 text-secondary mb-4" /> */}
                  <h3 className="text-2xl font-bold mb-2">
                    Instant Course Creation
                  </h3>
                  <p className="text-muted-foreground">
                    Generate comprehensive courses on any topic in seconds with
                    our advanced AI engine
                  </p>
                </CardContent>
              </Card>

              {/* Stats Cards */}
              {stats.map((stat, idx) => (
                <Card
                  key={idx}
                  className={`bg-card/50 backdrop-blur-sm border transition-all duration-500 group hover:scale-105 ${
                    activeStatIndex === idx
                      ? "border-secondary/50 bg-secondary/5"
                      : "border-border"
                  }`}
                >
                  <CardContent className="p-6 text-center space-y-2">
                    <stat.icon
                      className={`w-8 h-8 mx-auto mb-2 transition-colors ${
                        activeStatIndex === idx
                          ? "text-secondary"
                          : "text-muted-foreground"
                      }`}
                    />
                    <div className="text-3xl font-bold text-gradient">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Modern Cards */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-20 space-y-4 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20">
              <Zap className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium text-secondary">
                Powerful Features
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold">
              Everything you need to
              <br />
              <span className="text-gradient">excel in learning</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Cutting-edge technology meets proven educational methods
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <Card
                key={idx}
                className="group relative overflow-hidden border-border bg-card hover:border-secondary/50 transition-all duration-500 hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />
                <CardContent className="p-8 relative z-10 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <feature.icon className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="text-2xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-secondary font-medium group-hover:translate-x-2 transition-transform">
                    Learn more <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Timeline Style */}
      <section className="py-32 bg-muted/30 relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-5xl md:text-6xl font-bold">
              Your learning journey
              <br />
              <span className="text-gradient">in three simple steps</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-1/4 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />

            {[
              {
                step: "01",
                title: "Choose Your Path",
                description:
                  "Select from 500+ expert-curated courses across multiple disciplines",
                icon: BookOpen,
              },
              {
                step: "02",
                title: "Learn & Practice",
                description:
                  "Engage with interactive content and AI-powered exercises",
                icon: Brain,
              },
              {
                step: "03",
                title: "Achieve Mastery",
                description:
                  "Track progress, earn certificates, and advance your career",
                icon: Rocket,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="relative animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.15}s` }}
              >
                <Card className="bg-card border-border hover:border-secondary/50 transition-all group">
                  <CardContent className="p-8 space-y-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <item.icon className="w-8 h-8 text-secondary" />
                      </div>
                      <div className="absolute -top-4 -right-4 text-6xl font-bold text-secondary/10">
                        {item.step}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section - Modern Testimonials */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-20 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20">
              <Star className="w-4 h-4 text-secondary fill-secondary" />
              <span className="text-sm font-medium text-secondary">
                Testimonials
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold">
              Loved by learners
              <br />
              <span className="text-gradient">around the world</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review, idx) => (
              <Card
                key={idx}
                className="bg-card/50 backdrop-blur-sm border-border hover:border-secondary/50 transition-all hover:scale-105 animate-fade-in-up group"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <CardContent className="p-8 space-y-6">
                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-secondary text-secondary"
                      />
                    ))}
                  </div>
                  <p className="text-lg leading-relaxed">
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-purple-600 flex items-center justify-center text-white font-bold">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold">{review.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Verified Student
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section - Modern Grid */}
      <section className="py-32 bg-muted/30">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-5xl md:text-6xl font-bold">
              Meet the minds
              <br />
              <span className="text-gradient">behind the platform</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Passionate educators and technologists building the future of
              learning
            </p>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-5xl mx-auto"
          >
            <CarouselContent className="-ml-4">
              {team.map((member, idx) => (
                <CarouselItem
                  key={idx}
                  className="pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <Card className="group bg-card border-border hover:border-secondary/50 transition-all hover:scale-105 overflow-hidden h-full">
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden aspect-square">
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
                        <img
                          src={`${serverUrl}${member.image}`}
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6 text-center space-y-2">
                        <h3 className="text-xl font-bold">{member.name}</h3>
                        <p className="text-secondary font-medium">
                          {member.role}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </section>

      {/* CTA Section - Bold & Modern */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-purple-500/10 to-transparent" />
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <Card className="bg-gradient-to-br from-secondary/10 to-purple-500/10 border-secondary/20 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-12 md:p-16 text-center space-y-8 relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />

              <div className="relative z-10 space-y-6">
                <h2 className="text-5xl md:text-6xl font-bold leading-tight">
                  Ready to transform
                  <br />
                  <span className="text-gradient">your learning journey?</span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Join thousands of learners already mastering new skills with
                  AI-powered education
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button
                    size="lg"
                    onClick={() =>
                      user ? navigate("/dashboard") : navigate("/login")
                    }
                    className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg px-10 py-7 rounded-2xl group"
                  >
                    Start Learning Now
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-8 pt-8">
                  {[
                    { icon: CheckCircle2, text: "No credit card required" },
                    { icon: CheckCircle2, text: "Cancel anytime" },
                    { icon: CheckCircle2, text: "14-day free trial" },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <item.icon className="w-4 h-4 text-secondary" />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
