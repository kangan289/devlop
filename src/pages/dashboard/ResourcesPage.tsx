import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  IconSearch,
  IconBook,
  IconVideo,
  IconArticle,
  IconCode,
  IconCertificate,
  IconDownload,
  IconExternalLink,
  IconBookmark,
  IconStar,
  IconClockHour4,
  IconDeviceLaptop,
  IconEye,
  IconFilter
} from '@tabler/icons-react';

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 + (i * 0.05),
      duration: 0.3,
    },
  }),
};

// Mock data for resources
const resourcesData = [
  {
    id: 1,
    title: 'Getting Started with Google Cloud',
    description: 'A comprehensive guide to the basics of Google Cloud Platform',
    type: 'guide',
    category: 'fundamentals',
    icon: <IconBook size={20} />,
    featured: true,
    difficulty: 'beginner',
    timeToComplete: '45 min',
    publishedDate: 'Jan 5, 2023',
    views: 15420,
    author: 'Google Cloud',
    link: 'https://cloud.google.com/docs/get-started',
    image: 'https://ext.same-assets.com/1544848213/3112357059.jpg'
  },
  {
    id: 2,
    title: 'Cloud Computing Essentials',
    description: 'Learn the core concepts of cloud computing and its benefits',
    type: 'video',
    category: 'fundamentals',
    icon: <IconVideo size={20} />,
    featured: false,
    difficulty: 'beginner',
    timeToComplete: '30 min',
    publishedDate: 'Feb 12, 2023',
    views: 8675,
    author: 'Cloud Academy',
    link: 'https://example.com/cloud-essentials',
    image: 'https://ext.same-assets.com/1544848213/2075453289.jpg'
  },
  {
    id: 3,
    title: 'Virtual Machine Deployment Guide',
    description: 'Step-by-step instructions for deploying and managing VMs in Google Cloud',
    type: 'tutorial',
    category: 'compute',
    icon: <IconDeviceLaptop size={20} />,
    featured: false,
    difficulty: 'intermediate',
    timeToComplete: '1.5 hours',
    publishedDate: 'Mar 20, 2023',
    views: 6540,
    author: 'Cloud Solutions',
    link: 'https://example.com/vm-deployment',
    image: 'https://ext.same-assets.com/1544848213/3290764125.jpg'
  },
  {
    id: 4,
    title: 'Database Migration Best Practices',
    description: 'Learn how to migrate your databases to Google Cloud with minimal downtime',
    type: 'article',
    category: 'data',
    icon: <IconArticle size={20} />,
    featured: true,
    difficulty: 'advanced',
    timeToComplete: '20 min',
    publishedDate: 'Apr 15, 2023',
    views: 4230,
    author: 'Database Experts',
    link: 'https://example.com/database-migration',
    image: 'https://ext.same-assets.com/1544848213/1839021574.jpg'
  },
  {
    id: 5,
    title: 'Securing Your Cloud Infrastructure',
    description: 'Essential security practices for Google Cloud resources',
    type: 'guide',
    category: 'security',
    icon: <IconBook size={20} />,
    featured: true,
    difficulty: 'intermediate',
    timeToComplete: '1 hour',
    publishedDate: 'May 8, 2023',
    views: 9870,
    author: 'Security Team',
    link: 'https://example.com/cloud-security',
    image: 'https://ext.same-assets.com/1544848213/3807645291.jpg'
  },
  {
    id: 6,
    title: 'Kubernetes for Beginners',
    description: 'Introduction to container orchestration with Google Kubernetes Engine',
    type: 'video',
    category: 'container',
    icon: <IconVideo size={20} />,
    featured: false,
    difficulty: 'beginner',
    timeToComplete: '2 hours',
    publishedDate: 'Jun 22, 2023',
    views: 12340,
    author: 'Container Academy',
    link: 'https://example.com/kubernetes-beginners',
    image: 'https://ext.same-assets.com/1544848213/2057128394.jpg'
  },
  {
    id: 7,
    title: 'Advanced Networking in Google Cloud',
    description: 'Deep dive into GCP networking concepts and implementations',
    type: 'tutorial',
    category: 'networking',
    icon: <IconDeviceLaptop size={20} />,
    featured: false,
    difficulty: 'advanced',
    timeToComplete: '3 hours',
    publishedDate: 'Jul 10, 2023',
    views: 3560,
    author: 'Network Solutions',
    link: 'https://example.com/gcp-networking',
    image: 'https://ext.same-assets.com/1544848213/3875412695.jpg'
  },
  {
    id: 8,
    title: 'Building ML Models with Vertex AI',
    description: 'Learn to develop and deploy machine learning models on Google Cloud',
    type: 'article',
    category: 'ml',
    icon: <IconArticle size={20} />,
    featured: true,
    difficulty: 'advanced',
    timeToComplete: '45 min',
    publishedDate: 'Aug 5, 2023',
    views: 7650,
    author: 'AI Specialists',
    link: 'https://example.com/vertex-ai',
    image: 'https://ext.same-assets.com/1544848213/1907654321.jpg'
  },
  {
    id: 9,
    title: 'Cloud Certification Prep Guide',
    description: 'Comprehensive preparation guide for Google Cloud certifications',
    type: 'guide',
    category: 'certification',
    icon: <IconCertificate size={20} />,
    featured: true,
    difficulty: 'intermediate',
    timeToComplete: '5 hours',
    publishedDate: 'Sep 18, 2023',
    views: 18790,
    author: 'Certification Pros',
    link: 'https://example.com/cloud-certification',
    image: 'https://ext.same-assets.com/1544848213/3957612840.jpg'
  },
  {
    id: 10,
    title: 'Serverless Applications with Cloud Functions',
    description: 'Building event-driven applications without server management',
    type: 'tutorial',
    category: 'serverless',
    icon: <IconCode size={20} />,
    featured: false,
    difficulty: 'intermediate',
    timeToComplete: '2 hours',
    publishedDate: 'Oct 30, 2023',
    views: 5430,
    author: 'Serverless Team',
    link: 'https://example.com/cloud-functions',
    image: 'https://ext.same-assets.com/1544848213/1023874596.jpg'
  },
  {
    id: 11,
    title: 'Big Data Processing with Dataflow',
    description: 'Processing large datasets with Google Cloud Dataflow',
    type: 'video',
    category: 'data',
    icon: <IconVideo size={20} />,
    featured: false,
    difficulty: 'advanced',
    timeToComplete: '1.5 hours',
    publishedDate: 'Nov 12, 2023',
    views: 4120,
    author: 'Data Engineers',
    link: 'https://example.com/dataflow',
    image: 'https://ext.same-assets.com/1544848213/3654789021.jpg'
  },
  {
    id: 12,
    title: 'Cost Optimization Strategies',
    description: 'Best practices to optimize your Google Cloud costs',
    type: 'article',
    category: 'management',
    icon: <IconArticle size={20} />,
    featured: true,
    difficulty: 'intermediate',
    timeToComplete: '30 min',
    publishedDate: 'Dec 5, 2023',
    views: 10870,
    author: 'Cloud Optimizers',
    link: 'https://example.com/cost-optimization',
    image: 'https://ext.same-assets.com/1544848213/2138976540.jpg'
  },
];

export function ResourcesPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeType, setActiveType] = useState('all');
  const [activeDifficulty, setActiveDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  // Filter resources based on active filters and search query
  const filteredResources = resourcesData.filter(resource => {
    const matchesCategory =
      activeFilter === 'all' ||
      activeFilter === resource.category;

    const matchesType =
      activeType === 'all' ||
      activeType === resource.type;

    const matchesDifficulty =
      activeDifficulty === 'all' ||
      activeDifficulty === resource.difficulty;

    const matchesSearch =
      searchQuery === '' ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesType && matchesDifficulty && matchesSearch;
  });

  // Get featured resources
  const featuredResources = resourcesData.filter(resource => resource.featured).slice(0, 3);

  return (
    <div className="space-y-8" ref={ref}>
      {/* Featured resources banner */}
      <section>
        <h2 className="text-xl font-bold mb-4">Featured Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredResources.map((resource, index) => (
            <motion.div
              key={resource.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="col-span-1"
            >
              <Card className="overflow-hidden google-card h-full flex flex-col">
                <div className="relative h-40 overflow-hidden">
                  <motion.img
                    src={resource.image}
                    alt={resource.title}
                    className="w-full h-full object-cover transition-transform"
                    whileHover={{ scale: 1.05 }}
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-primary text-white">Featured</Badge>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-muted/50 text-xs">
                      {resource.category.charAt(0).toUpperCase() + resource.category.slice(1)}
                    </Badge>
                    <div className="flex items-center text-muted-foreground text-xs">
                      <IconEye size={12} className="mr-1" />
                      {resource.views.toLocaleString()}
                    </div>
                  </div>
                  <CardTitle className="text-lg mt-2">{resource.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-4 flex-grow">
                  <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <IconClockHour4 size={14} className="mr-1" />
                    <span>{resource.timeToComplete}</span>
                    <span className="mx-2">•</span>
                    <span className="capitalize">{resource.difficulty}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white" asChild>
                    <a href={resource.link} target="_blank" rel="noreferrer">
                      <IconExternalLink size={16} className="mr-2" />
                      Open Resource
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-grow max-w-md">
          <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search resources..."
            className="pl-9 h-10 w-full rounded-md border bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <select
            className="h-10 rounded-md border bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="fundamentals">Fundamentals</option>
            <option value="compute">Compute</option>
            <option value="data">Data</option>
            <option value="networking">Networking</option>
            <option value="security">Security</option>
            <option value="container">Containers</option>
            <option value="serverless">Serverless</option>
            <option value="ml">Machine Learning</option>
            <option value="certification">Certification</option>
            <option value="management">Management</option>
          </select>

          <select
            className="h-10 rounded-md border bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={activeType}
            onChange={(e) => setActiveType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="guide">Guides</option>
            <option value="video">Videos</option>
            <option value="article">Articles</option>
            <option value="tutorial">Tutorials</option>
          </select>

          <select
            className="h-10 rounded-md border bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={activeDifficulty}
            onChange={(e) => setActiveDifficulty(e.target.value)}
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          {(activeFilter !== 'all' || activeType !== 'all' || activeDifficulty !== 'all' || searchQuery !== '') && (
            <Button
              variant="outline"
              size="sm"
              className="h-10"
              onClick={() => {
                setActiveFilter('all');
                setActiveType('all');
                setActiveDifficulty('all');
                setSearchQuery('');
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* All resources */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">All Resources</h2>
          <span className="text-sm text-muted-foreground">Showing {filteredResources.length} of {resourcesData.length} resources</span>
        </div>

        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource, index) => (
              <motion.div
                key={resource.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
              >
                <Card className="google-card h-full flex flex-col hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center mb-2">
                      <Badge
                        variant="outline"
                        className={`
                          ${resource.type === 'guide' ? 'bg-google-blue/10 text-google-blue' :
                            resource.type === 'video' ? 'bg-google-red/10 text-google-red' :
                            resource.type === 'article' ? 'bg-google-green/10 text-google-green' :
                            'bg-google-yellow/10 text-google-yellow'}
                        `}
                      >
                        <span className="flex items-center">
                          {resource.icon}
                          <span className="ml-1 capitalize">{resource.type}</span>
                        </span>
                      </Badge>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <IconBookmark size={16} className="text-muted-foreground" />
                          <span className="sr-only">Bookmark</span>
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-base md:text-lg">{resource.title}</CardTitle>
                    <CardDescription className="line-clamp-2 text-xs md:text-sm">
                      {resource.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2 pt-0 flex-grow">
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline" className="text-xs bg-muted/30">
                        {resource.category.charAt(0).toUpperCase() + resource.category.slice(1)}
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-muted/30 capitalize">
                        {resource.difficulty}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <IconClockHour4 size={14} className="mr-1" />
                        {resource.timeToComplete}
                      </div>
                      <div className="flex items-center">
                        <IconEye size={14} className="mr-1" />
                        {resource.views.toLocaleString()}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button className="w-full" variant="outline" asChild>
                      <a href={resource.link} target="_blank" rel="noreferrer">
                        <IconExternalLink size={16} className="mr-2" />
                        View Resource
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-muted/5">
            <IconFilter size={40} className="mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No resources found</h3>
            <p className="text-muted-foreground text-center max-w-md mb-4">
              Try adjusting your filters or search query to find resources.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setActiveFilter('all');
                setActiveType('all');
                setActiveDifficulty('all');
                setSearchQuery('');
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </section>

      {/* Coming soon section */}
      <section className="mt-12">
        <div className="bg-muted/5 border rounded-xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent" />

          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
            <p className="text-muted-foreground mb-6 max-w-xl">
              We're constantly adding new resources to help you on your Google Cloud journey.
              Subscribe to our newsletter to be notified when new content is available.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="h-10 rounded-md border bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring max-w-sm"
              />
              <Button className="bg-primary hover:bg-primary/90 text-white">
                Subscribe for Updates
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
