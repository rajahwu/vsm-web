'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mountain, Eye, Users, Cog, Star, ArrowRight, Mail } from "lucide-react";
import Image from "next/image";

const LandingPage = () => {
  const scrollToSection = (id: string) => {
    const element = document.querySelector(`[data-section="${id}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Misty Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: "url('/images/misty_background_20250925_221255.png')"
          }}
        />
        <div className="absolute inset-0 bg-hero" />
        
        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="relative h-24 w-64">
              <Image 
                src="/images/mountain_logo_20250925_221253.png" 
                alt="VSM Schools Logo" 
                fill
                className="object-contain filter brightness-0 invert"
                priority
              />
            </div>
          </div>
          
          {/* Brand Name */}
          <h1 className="font-heading text-6xl md:text-7xl lg:text-8xl mb-6 tracking-tight">
            VSM Schools
          </h1>
          
          {/* Main Headline */}
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl mb-8 text-white/90">
            Climb Higher. See Clearer.
          </h2>
          
          {/* Positioning Blurb */}
          <p className="text-xl md:text-2xl mb-12 text-white/80 max-w-2xl mx-auto leading-relaxed">
            A quiet place to master the visual systems craft.
          </p>
          
          {/* CTA Button */}
          <Button 
            size="lg" 
            className="bg-white/10 text-white border border-white/20 hover:bg-white/20 text-lg px-8 py-6 rounded-xl backdrop-blur-sm transition-smooth shadow-glow"
          >
            Start Your Practice
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Value Pillars Section */}
      <section className="py-24 px-4 bg-misty" data-section="pillars">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl mb-6 text-primary">
              Four Pillars of Practice
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our approach to mastering visual systems thinking is built on these foundational principles.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Clarity Pillar */}
            <Card className="text-center shadow-card hover:shadow-glow transition-smooth border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="mx-auto mb-4 p-4 rounded-full bg-accent/10">
                  <Eye className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="font-heading text-2xl text-primary">Clarity</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Develop the ability to see systems clearly through disciplined observation and structured thinking.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Mastery Pillar */}
            <Card className="text-center shadow-card hover:shadow-glow transition-smooth border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="mx-auto mb-4 p-4 rounded-full bg-accent/10">
                  <Mountain className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="font-heading text-2xl text-primary">Mastery</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Build skills through structured practice, like a monk perfecting their craft through repetition.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Community Pillar */}
            <Card className="text-center shadow-card hover:shadow-glow transition-smooth border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="mx-auto mb-4 p-4 rounded-full bg-accent/10">
                  <Users className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="font-heading text-2xl text-primary">Community</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Learn alongside like-minded thinkers in a supportive environment of shared growth.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Application Pillar */}
            <Card className="text-center shadow-card hover:shadow-glow transition-smooth border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="mx-auto mb-4 p-4 rounded-full bg-accent/10">
                  <Cog className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="font-heading text-2xl text-primary">Application</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Apply visual thinking to real-world problems with tools that become pathways to wisdom.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Bootcamp Program Section */}
      <section className="py-24 px-4 bg-white" data-section="bootcamp">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Program Content */}
            <div>
              <Badge className="mb-6 bg-accent text-accent-foreground px-4 py-2 text-sm font-medium">
                Join the Dojo
              </Badge>
              <h2 className="font-heading text-4xl md:text-5xl mb-6 text-primary">
                VSM Bootcamp Program
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                A 6-week intensive course to master visual systems thinking through guided practice and community learning.
              </p>
              
              {/* Week Highlights */}
              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-primary mb-2">Week 1-2: Foundation</h4>
                    <p className="text-muted-foreground">Master the fundamentals of visual systems thinking and establish your practice routine.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-primary mb-2">Advanced Techniques</h4>
                    <p className="text-muted-foreground">Dive deeper into complex system visualization and advanced methodologies.</p>
                  </div>
                </div>
              </div>
              
              {/* Features */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Live weekly sessions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Hands-on projects</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Personal feedback</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Community access</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 rounded-xl">
                  Enroll Now - $997
                </Button>
                <span className="text-2xl font-bold text-accent">$997</span>
              </div>
            </div>
            
            {/* Program Visual */}
            <div className="relative">
              <Card className="shadow-card border-0 bg-gradient-to-br from-primary/5 to-accent/5 p-8">
                <div className="text-center">
                  <Mountain className="h-16 w-16 text-accent mx-auto mb-6" />
                  <h3 className="font-heading text-2xl text-primary mb-4">Transform Your Thinking</h3>
                  <p className="text-muted-foreground mb-6">
                    Join hundreds of practitioners who have elevated their visual systems thinking through our structured approach.
                  </p>
                  <div className="flex justify-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">4.9/5 from 200+ students</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 bg-misty" data-section="testimonials">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl mb-6 text-primary">
              Why VSM Schools
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hear from practitioners who have transformed their approach to complex systems.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <Card className="shadow-card border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <blockquote className="text-muted-foreground mb-6 leading-relaxed">
                  "VSM Schools transformed how I approach complex problems. The visual thinking frameworks are invaluable."
                </blockquote>
                <div>
                  <div className="font-semibold text-primary">Alex Johnson</div>
                  <div className="text-sm text-muted-foreground">Design Lead</div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card className="shadow-card border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <blockquote className="text-muted-foreground mb-6 leading-relaxed">
                  "The monk/mountain philosophy resonated with me. I've gained clarity I didn't think was possible."
                </blockquote>
                <div>
                  <div className="font-semibold text-primary">Maya Patel</div>
                  <div className="text-sm text-muted-foreground">Product Manager</div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card className="shadow-card border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <blockquote className="text-muted-foreground mb-6 leading-relaxed">
                  "Worth every penny. I now have a systematic approach to visualizing systems that was missing in my toolkit."
                </blockquote>
                <div>
                  <div className="font-semibold text-primary">Chris Lee</div>
                  <div className="text-sm text-muted-foreground">Entrepreneur</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call-to-Action Footer */}
      <section className="py-24 px-4 bg-hero">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="font-heading text-4xl md:text-5xl mb-6">
            Begin Your Journey
          </h2>
          <p className="text-xl mb-12 text-white/80 max-w-2xl mx-auto leading-relaxed">
            Join our community of visual systems thinkers and start your practice today.
          </p>
          
          {/* Sign-up Form */}
          <Card className="max-w-md mx-auto mb-12 bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-8">
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white text-left block">Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Your full name" 
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white text-left block">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="your@email.com" 
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white/50"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-6 rounded-xl font-semibold"
                >
                  Start Your Practice
                  <Mail className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {/* Footer Links */}
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 text-white/80">
            <button onClick={() => scrollToSection('bootcamp')} className="hover:text-white transition-smooth bg-transparent border-none cursor-pointer text-base">View Courses</button>
            <Separator orientation="vertical" className="hidden md:block h-4 bg-white/30" />
            <button onClick={() => scrollToSection('pillars')} className="hover:text-white transition-smooth bg-transparent border-none cursor-pointer text-base">Learning Framework</button>
            <Separator orientation="vertical" className="hidden md:block h-4 bg-white/30" />
            <button onClick={() => scrollToSection('testimonials')} className="hover:text-white transition-smooth bg-transparent border-none cursor-pointer text-base">Community Stories</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;