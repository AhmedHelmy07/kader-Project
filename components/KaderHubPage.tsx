import React, { useEffect, useState } from 'react';
import { onCoursesChanged, onJobsChanged, Course, Job } from '../services/firestore';
import { KaderLogo } from './icons/KaderLogo';

const KaderHubPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeTab, setActiveTab] = useState<'courses' | 'jobs'>('courses');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const offCourses = onCoursesChanged(items => setCourses(items));
    const offJobs = onJobsChanged(items => setJobs(items));
    return () => {
      offCourses();
      offJobs();
    };
  }, []);

  const courseCategories = ['All', ...Array.from(new Set(courses.map(c => c.category)))];
  const jobCategories = ['All', ...Array.from(new Set(jobs.map(j => j.category)))];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <KaderLogo className="h-24 relative z-10" />
            </div>
          </div>
          <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">
            Kader Hub
          </h1>
          <p className="text-xl text-cyan-200 max-w-3xl mx-auto">
            Empowering your career and knowledge with professional courses and job opportunities
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 animate-fade-in-delay">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
              >
                {(activeTab === 'courses' ? courseCategories : jobCategories).map(cat => (
                  <option key={cat} value={cat} className="bg-gray-900">{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 animate-fade-in-delay-2">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-2 border border-white/10 inline-flex gap-2">
            <button
              onClick={() => { setActiveTab('courses'); setSelectedCategory('All'); setSearchQuery(''); }}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'courses'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Courses
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">{courses.length}</span>
            </button>
            <button
              onClick={() => { setActiveTab('jobs'); setSelectedCategory('All'); setSearchQuery(''); }}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'jobs'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Jobs
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">{jobs.length}</span>
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'courses' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p className="text-gray-400 text-lg">No courses found</p>
              </div>
            ) : (
              filteredCourses.map((course, idx) => (
                <CourseCard key={course.id} course={course} index={idx} />
              ))
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredJobs.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-400 text-lg">No jobs found</p>
              </div>
            ) : (
              filteredJobs.map((job, idx) => (
                <JobCard key={job.id} job={job} index={idx} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const CourseCard: React.FC<{ course: Course; index: number }> = ({ course, index }) => {
  const levelColors: Record<string, string> = {
    'Beginner': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Intermediate': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Advanced': 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <div
      className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {course.image && (
        <div className="h-48 overflow-hidden">
          <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${levelColors[course.level]}`}>
            {course.level}
          </span>
          {course.rating && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-yellow-400 text-sm font-medium">{course.rating}</span>
            </div>
          )}
        </div>

        <h3 className="text-white font-bold text-xl mb-2">{course.title}</h3>
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{course.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>{course.instructor}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{course.duration}</span>
          </div>
          {course.enrolled !== undefined && (
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>{course.enrolled} enrolled</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          {course.price !== undefined && course.price > 0 ? (
            <span className="text-2xl font-bold text-cyan-400">${course.price}</span>
          ) : (
            <span className="text-lg font-bold text-green-400">Free</span>
          )}
          <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105">
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
};

const JobCard: React.FC<{ job: Job; index: number }> = ({ job, index }) => {
  const typeColors: Record<string, string> = {
    'Full-time': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Part-time': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'Contract': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'Remote': 'bg-green-500/20 text-green-400 border-green-500/30',
  };

  return (
    <div
      className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 p-6 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-white font-bold text-xl mb-1">{job.title}</h3>
          <p className="text-cyan-400 font-semibold">{job.company}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${typeColors[job.type]}`}>
          {job.type}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{job.location}</span>
        </div>
        {job.salary && (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{job.salary}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <span>{job.category}</span>
        </div>
      </div>

      <p className="text-gray-300 text-sm mb-4 line-clamp-3">{job.description}</p>

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <span className="text-gray-400 text-xs">{job.posted || 'Recently posted'}</span>
        <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105">
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default KaderHubPage;
