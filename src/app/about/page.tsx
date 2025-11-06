'use client';

import { useState } from 'react';

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('story');

  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "CEO & Founder",
      bio: "Alex has over 15 years of experience in media and streaming technologies. Before founding FlowTV, Alex led engineering teams at major tech companies.",
      image: "/placeholder-avatar-1.jpg"
    },
    {
      name: "Maria Garcia",
      role: "CTO",
      bio: "Maria is a streaming technology expert with a PhD in Computer Science. She's responsible for our cutting-edge streaming infrastructure.",
      image: "/placeholder-avatar-2.jpg"
    },
    {
      name: "David Chen",
      role: "Head of Product",
      bio: "David brings 10 years of product management experience from leading media companies. He's passionate about creating seamless user experiences.",
      image: "/placeholder-avatar-3.jpg"
    },
    {
      name: "Sarah Williams",
      role: "Lead Designer",
      bio: "Sarah has designed award-winning interfaces for media applications. Her focus is on creating beautiful, intuitive user experiences.",
      image: "/placeholder-avatar-4.jpg"
    }
  ];

  const milestones = [
    { year: "2020", event: "Company founded with a mission to revolutionize IPTV streaming" },
    { year: "2021", event: "Launched beta version with 100 channels" },
    { year: "2022", event: "Reached 10,000 active users and expanded to 500 channels" },
    { year: "2023", event: "Introduced 4K streaming and multi-device support" },
    { year: "2024", event: "Expanded globally with support for 20 languages" },
    { year: "2025", event: "Launched AI-powered recommendations and personalization" }
  ];

  const technologies = [
    { name: "Next.js", description: "React framework for production" },
    { name: "Firebase", description: "Backend as a Service for authentication and data" },
    { name: "HLS.js", description: "HTTP Live Streaming for adaptive bitrate streaming" },
    { name: "Tailwind CSS", description: "Utility-first CSS framework" },
    { name: "TypeScript", description: "Typed superset of JavaScript" },
    { name: "Node.js", description: "JavaScript runtime for server-side logic" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            <span className="block">About</span>
            <span className="block text-gradient mt-2">FlowTV</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We're on a mission to transform how people experience live television and on-demand content with our innovative streaming platform.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 text-center">
            <div className="text-3xl font-bold text-blue-500 mb-2">5000+</div>
            <div className="text-gray-300">Active Users</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 text-center">
            <div className="text-3xl font-bold text-blue-500 mb-2">1000+</div>
            <div className="text-gray-300">Live Channels</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 text-center">
            <div className="text-3xl font-bold text-blue-500 mb-2">50+</div>
            <div className="text-gray-300">Countries</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 text-center">
            <div className="text-3xl font-bold text-blue-500 mb-2">24/7</div>
            <div className="text-gray-300">Support</div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-16">
          <div className="flex flex-wrap border-b border-gray-700 mb-8">
            <button
              className={`py-3 px-6 font-medium text-sm rounded-t-lg transition-colors ${
                activeTab === 'story'
                  ? 'text-white border-b-2 border-blue-500 bg-gray-800/50'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('story')}
            >
              Our Story
            </button>
            <button
              className={`py-3 px-6 font-medium text-sm rounded-t-lg transition-colors ${
                activeTab === 'mission'
                  ? 'text-white border-b-2 border-blue-500 bg-gray-800/50'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('mission')}
            >
              Mission & Values
            </button>
            <button
              className={`py-3 px-6 font-medium text-sm rounded-t-lg transition-colors ${
                activeTab === 'team'
                  ? 'text-white border-b-2 border-blue-500 bg-gray-800/50'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('team')}
            >
              Our Team
            </button>
            <button
              className={`py-3 px-6 font-medium text-sm rounded-t-lg transition-colors ${
                activeTab === 'tech'
                  ? 'text-white border-b-2 border-blue-500 bg-gray-800/50'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('tech')}
            >
              Technology
            </button>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
            {activeTab === 'story' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Our Story</h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 mb-4">
                    FlowTV was born out of a simple idea: watching TV should be effortless, enjoyable, and accessible to everyone, everywhere. 
                    In 2020, our founder Alex Johnson was frustrated with the fragmented, complicated landscape of IPTV services. 
                    He envisioned a platform that would bring together the best of live television and on-demand content in one seamless experience.
                  </p>
                  <p className="text-gray-300 mb-4">
                    What started as a small project in a garage has grown into a global platform serving thousands of users across 50+ countries. 
                    Our team of passionate engineers, designers, and content experts have worked tirelessly to create a streaming experience 
                    that's not just about watching TV, but about discovering new content and connecting with stories that matter.
                  </p>
                  <p className="text-gray-300">
                    Today, FlowTV offers over 1000 live channels and a growing library of on-demand content, with new features and improvements 
                    added every month. We're proud of what we've built, but we're even more excited about where we're going.
                  </p>
                </div>
                
                <div className="mt-10">
                  <h3 className="text-xl font-bold mb-6">Key Milestones</h3>
                  <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-700 transform translate-x-1/2"></div>
                    
                    <ul className="space-y-12">
                      {milestones.map((milestone, index) => (
                        <li key={index} className="relative pl-16">
                          <div className="absolute left-0 top-1.5 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                            <span className="text-white font-bold">{milestone.year.substring(2)}</span>
                          </div>
                          <div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
                            <h4 className="text-lg font-bold text-white mb-2">{milestone.year}</h4>
                            <p className="text-gray-300">{milestone.event}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'mission' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Our Mission & Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-blue-400">Our Mission</h3>
                    <p className="text-gray-300 mb-6">
                      To democratize access to quality content by providing a seamless, innovative, and affordable streaming platform 
                      that connects people with the stories they love, wherever they are in the world.
                    </p>
                    
                    <h3 className="text-xl font-bold mb-4 text-blue-400">Our Vision</h3>
                    <p className="text-gray-300">
                      To become the world's most trusted and beloved streaming platform, known for our commitment to quality, 
                      innovation, and user satisfaction.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold mb-4">Our Core Values</h3>
                    <ul className="space-y-4">
                      <li className="flex">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-5 h-5 rounded-full bg-blue-500"></div>
                        </div>
                        <div className="ml-3">
                          <h4 className="font-bold text-white">Innovation</h4>
                          <p className="text-gray-300 text-sm">We constantly push boundaries to deliver cutting-edge streaming technology.</p>
                        </div>
                      </li>
                      <li className="flex">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-5 h-5 rounded-full bg-blue-500"></div>
                        </div>
                        <div className="ml-3">
                          <h4 className="font-bold text-white">User-First</h4>
                          <p className="text-gray-300 text-sm">Everything we do is focused on creating the best possible user experience.</p>
                        </div>
                      </li>
                      <li className="flex">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-5 h-5 rounded-full bg-blue-500"></div>
                        </div>
                        <div className="ml-3">
                          <h4 className="font-bold text-white">Integrity</h4>
                          <p className="text-gray-300 text-sm">We operate with transparency and honesty in all our dealings.</p>
                        </div>
                      </li>
                      <li className="flex">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-5 h-5 rounded-full bg-blue-500"></div>
                        </div>
                        <div className="ml-3">
                          <h4 className="font-bold text-white">Inclusivity</h4>
                          <p className="text-gray-300 text-sm">We believe quality content should be accessible to everyone, everywhere.</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'team' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Meet Our Team</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="bg-gray-700/50 rounded-xl p-6 border border-gray-600 hover:border-blue-500 transition-colors">
                      <div className="bg-gray-600 border-2 border-dashed rounded-xl w-16 h-16 mb-4" />
                      <h3 className="text-lg font-bold text-white">{member.name}</h3>
                      <p className="text-blue-400 text-sm mb-3">{member.role}</p>
                      <p className="text-gray-300 text-sm">{member.bio}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-10 pt-8 border-t border-gray-700">
                  <h3 className="text-xl font-bold mb-4">Join Our Team</h3>
                  <p className="text-gray-300 mb-4">
                    We're always looking for talented individuals who share our passion for innovation and quality. 
                    If you're interested in joining our team, we'd love to hear from you.
                  </p>
                  <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors">
                    View Open Positions
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'tech' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Our Technology Stack</h2>
                <p className="text-gray-300 mb-8">
                  FlowTV is built on a modern, scalable technology stack that ensures high performance, reliability, and security.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {technologies.map((tech, index) => (
                    <div key={index} className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
                      <h3 className="text-lg font-bold text-white mb-2">{tech.name}</h3>
                      <p className="text-gray-300 text-sm">{tech.description}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-10">
                  <h3 className="text-xl font-bold mb-4">Infrastructure</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
                      <div className="text-blue-500 mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                        </svg>
                      </div>
                      <h4 className="font-bold text-white mb-2">Global CDN</h4>
                      <p className="text-gray-300 text-sm">Distributed content delivery network for low-latency streaming worldwide</p>
                    </div>
                    
                    <div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
                      <div className="text-blue-500 mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <h4 className="font-bold text-white mb-2">Security</h4>
                      <p className="text-gray-300 text-sm">End-to-end encryption and secure authentication for all user data</p>
                    </div>
                    
                    <div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
                      <div className="text-blue-500 mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                        </svg>
                      </div>
                      <h4 className="font-bold text-white mb-2">Scalability</h4>
                      <p className="text-gray-300 text-sm">Auto-scaling infrastructure that adapts to user demand in real-time</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <p className="text-gray-300 mb-6">
                Have questions, feedback, or just want to say hello? We'd love to hear from you.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-bold text-white">Email</h3>
                    <p className="text-gray-300">support@flowtv.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-bold text-white">Phone</h3>
                    <p className="text-gray-300">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-bold text-white">Office</h3>
                    <p className="text-gray-300">123 Streaming Street, Tech City, TC 10001</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-300">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-300">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your message"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transform transition hover:scale-[1.02] duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}