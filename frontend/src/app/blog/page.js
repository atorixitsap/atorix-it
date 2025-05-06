"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

// Blog posts data - using real content from old website
const blogPosts = [
  {
    id: "best-sap-implementation-partner-in-india",
    title: "BEST SAP IMPLEMENTATION PARTNER IN INDIA",
    description: "ATORIX IT SOLUTIONS - Best SAP Implementation Partner in India with expertise in SAP S/4HANA implementation and support services.",
    date: "May 24, 2023",
    author: "Atorix Team",
    authorRole: "SAP Implementation Expert",
    image: "/images/web-dev.svg",
    category: "SAP",
    readTime: "5 min read",
    content: `
      <p>ATORIX IT SOLUTIONS - Best SAP Implementation Partner in India with its head office in Pune. We provide robust, business process solutions for successful clients.</p>

      <p>Atorix IT Solutions is the Best SAP Implementation Partner in India with its head office in Pune. We provide robust, business process solutions for successful clients. From implementation to support, we ensure a seamless SAP experience tailored to your business needs.</p>

      <h3>Why Choose Atorix as Your SAP Implementation Partner?</h3>

      <ul>
        <li>Expertise in SAP S/4HANA Implementation</li>
        <li>Certified SAP Consultants</li>
        <li>Industry-Specific Solutions</li>
        <li>End-to-End Support</li>
        <li>Proven Implementation Methodology</li>
      </ul>

      <p>Partner with us for successful SAP implementations that drive digital transformation and business growth.</p>
    `
  },
  {
    id: "what-is-sap-solution-manager",
    title: "What is SAP Solution Manager?",
    description: "SAP Solution Manager (SolMan) is a module of SAP that provides functionalities like integrated content, methodologies, tools etc. Learn more about this essential SAP tool.",
    date: "February 28, 2023",
    author: "Atorix Team",
    authorRole: "SAP Technical Specialist",
    image: "/images/app.svg",
    category: "SAP",
    readTime: "7 min read",
    content: `
      <p>SAP Solution Manager (SolMan) is a module of SAP that provides functionalities like integrated content, methodologies, tools etc. To implement, operate, monitor and support an enterprise's SAP solution. SAP solution manager manages the SAP and Non-SAP solutions in the IT landscapes of an organization. It supports the underlying IT infrastructure and business processes.</p>

      <h3>Key Functions of SAP Solution Manager</h3>

      <p>SAP Solution Manager is central to your SAP landscape management, providing:</p>

      <ul>
        <li>Implementation and upgrade support</li>
        <li>Business process operations</li>
        <li>Application lifecycle management</li>
        <li>Change control management</li>
        <li>IT service management</li>
        <li>Monitoring and alerting functions</li>
        <li>Root cause analysis tools</li>
        <li>Testing support</li>
      </ul>

      <p>For organizations running SAP systems, Solution Manager is an essential tool for maintaining optimal system performance and ensuring smooth operations of their SAP landscape.</p>
    `
  },
  {
    id: "future-scope-of-sap",
    title: "Future Scope of SAP",
    description: "SAP is an idea that has revolutionized the recruitment scene in India. Explore the future opportunities and trends in SAP implementation and careers.",
    date: "February 7, 2023",
    author: "Atorix Team",
    authorRole: "SAP Strategic Consultant",
    image: "/images/consultation.svg",
    category: "SAP",
    readTime: "6 min read",
    content: `
      <p>SAP is an idea that has revolutionised the recruitment scene in India. Even though it is an extraordinarily new idea in the Indian context, the fact is that ERP software program applications are increasing through the minute right here and in this kind of state of affairs the want for SAP-licensed specialists is growing throughout horizontals and verticals.</p>

      <h3>Growing Demand for SAP Professionals</h3>

      <p>The demand for SAP experts continues to grow as more businesses adopt enterprise resource planning solutions. This growth is evident across various industries, creating numerous career opportunities for SAP specialists.</p>

      <h3>Future Trends in SAP</h3>

      <ul>
        <li>Increased adoption of SAP S/4HANA</li>
        <li>Cloud-based SAP implementations</li>
        <li>Integration with AI and machine learning</li>
        <li>Enhanced mobile capabilities</li>
        <li>IoT integration with SAP systems</li>
      </ul>

      <p>As businesses continue to digitally transform, the scope for SAP implementation and support services will continue to expand, making it a promising field for professionals and implementation partners alike.</p>
    `
  },
  {
    id: "sap-s4-hana-all-about-sap-s4-hana",
    title: "SAP S/4 HANA- All about SAP S/4 HANA",
    description: "S/4HANA is an acronym for SAP Business Suite 4 SAP HANA. Learn about this next-generation ERP system and its benefits for large enterprises.",
    date: "February 7, 2023",
    author: "Atorix Team",
    authorRole: "S/4HANA Expert",
    image: "/images/web.svg",
    category: "SAP",
    readTime: "8 min read",
    content: `
      <p>S/4HANA is an acronym for SAP Business Suite 4 SAP HANA. Similar to the shift from SAP R/2 to SAP R/3, it brings in the next significant wave of innovation for SAP clients. SAP S/4HANA is SAP's enterprise resource planning (ERP) system for large businesses. It is the successor to SAP R/3 and SAP ERP, and it is built on SAP HANA, the company's in-memory database.</p>

      <h3>Key Features of SAP S/4HANA</h3>

      <ul>
        <li>In-memory computing architecture for faster processing</li>
        <li>Simplified data model reducing database footprint</li>
        <li>Improved real-time analytics capabilities</li>
        <li>Modern user experience with SAP Fiori</li>
        <li>Enhanced planning and simulation features</li>
        <li>Embedded machine learning capabilities</li>
      </ul>

      <h3>Benefits of SAP S/4HANA</h3>

      <p>Businesses implementing S/4HANA can expect:</p>

      <ul>
        <li>Faster transaction processing and reporting</li>
        <li>Reduced total cost of ownership</li>
        <li>Improved decision-making with real-time insights</li>
        <li>Simplified IT landscape and operations</li>
        <li>Enhanced productivity through intuitive user interfaces</li>
        <li>Future-proofing business operations</li>
      </ul>

      <p>SAP S/4HANA represents the future of ERP systems, combining speed, simplicity, and innovative features to drive digital transformation.</p>
    `
  },
  {
    id: "data-migration-in-sap-s4-hana",
    title: "Data migration in SAP S/4 HANA - All about SAP HANA Migration Cockpit",
    description: "Data migration is a tool its mainly used in SAP for the system installations separately. Learn about the SAP HANA Migration Cockpit and best practices.",
    date: "February 7, 2023",
    author: "Atorix Team",
    authorRole: "Data Migration Specialist",
    image: "/images/hosting.svg",
    category: "SAP",
    readTime: "7 min read",
    content: `
      <p>Data migration is a tool its mainly used in SAP for the system installations separately. It is used to provide the data extraction and transformation, & load, In the same its gives quality data management and processing.</p>

      <h3>SAP HANA Migration Cockpit</h3>

      <p>The SAP S/4HANA Migration Cockpit is a tool designed to facilitate data migration to SAP S/4HANA. It provides a guided approach to data transfer from various source systems to SAP S/4HANA.</p>

      <h3>Key Features of the Migration Cockpit</h3>

      <ul>
        <li>Predefined migration content for common business objects</li>
        <li>Data extraction from various source systems</li>
        <li>Mapping capabilities for source and target fields</li>
        <li>Validation of migrated data</li>
        <li>Migration monitoring and error handling</li>
        <li>Support for multiple migration approaches</li>
      </ul>

      <h3>Migration Approaches</h3>

      <ol>
        <li><strong>File-Based Migration</strong>: Transfer data using CSV files</li>
        <li><strong>Direct Transfer</strong>: Connect directly to SAP source systems</li>
        <li><strong>Staging Tables</strong>: Use staging tables for complex transformations</li>
        <li><strong>SAP Cloud Platform Integration</strong>: Leverage cloud integration services</li>
      </ol>

      <p>Successful data migration is critical for any SAP S/4HANA implementation project. The Migration Cockpit simplifies this process, reducing risk and ensuring data quality in your new S/4HANA environment.</p>
    `
  }
];

// Animated blob background
function AnimatedBlobBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Main blob */}
      <motion.div
        className="absolute rounded-full bg-primary/10 blur-[120px]"
        style={{
          width: "50%",
          height: "50%",
          top: "10%",
          left: "10%",
        }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Secondary blob */}
      <motion.div
        className="absolute rounded-full bg-blue-500/10 blur-[100px]"
        style={{
          width: "35%",
          height: "35%",
          bottom: "20%",
          right: "5%",
        }}
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -30, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
    </div>
  );
}

export default function BlogPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
        <AnimatedBlobBackground />
        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              SAP Insights
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 pb-2 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
              Blog & Resources
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Expert insights, best practices, and industry trends to help you maximize your SAP investment and transform your business.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="border-b border-border/60 py-6">
        <div className="container-custom">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button variant="ghost" className="rounded-full bg-primary/10 text-primary" asChild>
              <Link href="/blog" className="font-medium">All Posts</Link>
            </Button>
            <Button variant="ghost" className="rounded-full" asChild>
              <Link href="/blog?category=implementation" className="text-muted-foreground hover:text-primary">Implementation</Link>
            </Button>
            <Button variant="ghost" className="rounded-full" asChild>
              <Link href="/blog?category=migration" className="text-muted-foreground hover:text-primary">Migration</Link>
            </Button>
            <Button variant="ghost" className="rounded-full" asChild>
              <Link href="/blog?category=support" className="text-muted-foreground hover:text-primary">Support</Link>
            </Button>
            <Button variant="ghost" className="rounded-full" asChild>
              <Link href="/blog?category=s4hana" className="text-muted-foreground hover:text-primary">S/4HANA</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
          >
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/20 px-3 py-1 text-xs font-medium text-blue-800 dark:text-blue-300 mb-4">
                {blogPosts[0].category}
              </div>
              <h2 className="text-3xl font-bold mb-4">
                <Link href={`/blog/${blogPosts[0].id}`} className="hover:text-primary transition-colors">
                  {blogPosts[0].title}
                </Link>
              </h2>
              <p className="text-muted-foreground mb-6">
                {blogPosts[0].description}
              </p>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  {blogPosts[0].author.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{blogPosts[0].author}</p>
                  <p className="text-sm text-muted-foreground">{blogPosts[0].date} · {blogPosts[0].readTime}</p>
                </div>
              </div>
              <Button asChild className="gap-2">
                <Link href={`/blog/${blogPosts[0].id}`}>
                  Read Article
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="order-1 lg:order-2">
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="aspect-[16/9] relative rounded-xl overflow-hidden border border-border/40 shadow-md"
              >
                <Image
                  src="/images/bg/services-bg.webp"
                  alt={blogPosts[0].title}
                  fill
                  className="object-cover transition-transform duration-500"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 bg-muted/30">
        <div className="container-custom">
          <h2 className="text-2xl font-bold mb-8">Latest Articles</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-xl overflow-hidden border border-border/40 hover:border-primary/30 hover:shadow-md transition-all duration-300"
              >
                <Link href={`/blog/${post.id}`} className="block">
                  <div className="aspect-[16/9] relative">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </Link>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/20 px-3 py-1 text-xs font-medium text-blue-800 dark:text-blue-300">
                      {post.category}
                    </div>
                    <span className="text-xs text-muted-foreground">{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">
                    <Link href={`/blog/${post.id}`} className="hover:text-primary transition-colors">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {post.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-border/60">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
                        {post.author.charAt(0)}
                      </div>
                      <span className="text-sm">{post.author}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{post.date}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="bg-primary text-white hover:bg-primary/90">
                1
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 md:py-24 relative">
        <AnimatedBlobBackground />
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-muted-foreground mb-8">
              Stay updated with the latest SAP insights, trends, and best practices delivered straight to your inbox.
            </p>
            <form className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 rounded-md border border-input bg-background flex-grow focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
                <Button type="submit" className="whitespace-nowrap">
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                By subscribing, you agree to our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>. You can unsubscribe at any time.
              </p>
            </form>
          </motion.div>
        </div>
      </section>
    </>
  );
}
