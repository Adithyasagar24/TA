'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Search, 
  Shield, 
  Heart, 
  Leaf, 
  ChevronRight, 
  CheckCircle, 
  BarChart3,
  Users,
  Target,
  ArrowRight
} from 'lucide-react';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const features = [
    {
      icon: Search,
      title: "Intelligent Questioning",
      description: "Our AI asks smart follow-up questions to gather comprehensive product information."
    },
    {
      icon: Shield,
      title: "Transparency Reports",
      description: "Get detailed reports covering ingredients, sustainability, ethics, and health impacts."
    },
    {
      icon: Heart,
      title: "Health-First Decisions",
      description: "Make informed choices that prioritize your health and wellbeing."
    },
    {
      icon: Leaf,
      title: "Sustainability Focus",
      description: "Understand the environmental impact of your product choices."
    }
  ];

  const benefits = [
    "Comprehensive ingredient analysis",
    "Sustainability impact assessment", 
    "Ethical sourcing verification",
    "Health and safety evaluation",
    "Alternative product recommendations",
    "Personalized transparency reports"
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products/new?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">Altibbe | Hedamo</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">
                How it Works
              </Link>
              <Link href="/products" className="text-gray-600 hover:text-gray-900 transition-colors">
                Products
              </Link>
              <Link href="/reports" className="text-gray-600 hover:text-gray-900 transition-colors">
                Reports
              </Link>
              <Link href="/products/new" className="btn-primary">
                Analyze Product
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Discover the{' '}
                <span className="gradient-text">Truth</span>{' '}
                About Your Products
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Get comprehensive transparency reports through intelligent questioning. 
                Make ethical, health-first decisions with detailed insights about ingredients, 
                sustainability, and safety.
              </p>
              
              {/* Search Form */}
              <form onSubmit={handleSearch} className="mb-8">
                <div className="flex max-w-md mx-auto lg:mx-0">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter product name, brand, or scan barcode..."
                    className="flex-1 form-input rounded-r-none border-r-0"
                  />
                  <button
                    type="submit"
                    className="bg-primary text-white px-6 py-3 rounded-r-lg hover:bg-primary/90 transition-colors"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </form>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/products/new" className="btn-primary inline-flex items-center">
                  Start Analysis
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <Link href="/demo" className="btn-outline inline-flex items-center">
                  View Demo
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              {/* Dashboard Preview */}
              <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Product Analysis</h3>
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Overall Score</span>
                      <span className="text-2xl font-bold text-green-600">85</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Health', score: 92, color: 'green' },
                      { label: 'Sustainability', score: 78, color: 'blue' },
                      { label: 'Ethics', score: 89, color: 'purple' },
                      { label: 'Safety', score: 94, color: 'green' }
                    ].map((item, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3 text-center">
                        <div className="text-xs text-gray-600 mb-1">{item.label}</div>
                        <div className={`text-lg font-bold text-${item.color}-600`}>{item.score}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How We Create Transparency
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our intelligent platform uses advanced questioning techniques to gather 
              comprehensive product information and generate detailed transparency reports.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Comprehensive Product Analysis
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our platform goes beyond surface-level information to provide deep insights 
                into every aspect of your products. Make informed decisions with confidence.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              {[
                { icon: BarChart3, title: "Data-Driven", desc: "Evidence-based analysis" },
                { icon: Users, title: "Community", desc: "Crowdsourced insights" },
                { icon: Target, title: "Personalized", desc: "Tailored to your needs" },
                { icon: Shield, title: "Verified", desc: "Fact-checked information" }
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm card-hover">
                  <item.icon className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Discover Product Truth?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of conscious consumers making informed decisions 
              with our transparency platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products/new" className="bg-white text-purple-700 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center">
                Analyze Your First Product
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/learn-more" className="border border-white text-white hover:bg-white hover:text-purple-700 px-8 py-4 rounded-lg font-semibold transition-colors">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Altibbe | Hedamo</span>
              </div>
              <p className="text-gray-400">
                Empowering ethical consumption through product transparency.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/how-it-works" className="hover:text-white transition-colors">How it Works</Link></li>
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/guides" className="hover:text-white transition-colors">Guides</Link></li>
                <li><Link href="/api" className="hover:text-white transition-colors">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Altibbe Hedamo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}