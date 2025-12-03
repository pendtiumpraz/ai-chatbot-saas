'use client';

import HealthcareTech from './HealthcareTech';
import DataAnalytics from './DataAnalytics';
import TeamCollaboration from './TeamCollaboration';
import Innovation from './Innovation';
import AssessIcon from './AssessIcon';
import IdentifyIcon from './IdentifyIcon';
import CloseIcon from './CloseIcon';
import GridPattern from './GridPattern';
import WavePattern from './WavePattern';
import AbstractShapes from './AbstractShapes';
import TeamAvatar from '../TeamAvatar';

/**
 * Visual showcase of all available illustrations
 * Use this component to preview and test all illustration assets
 */
export default function IllustrationShowcase() {
  const teamMembers = [
    'Soleh Ayubi',
    'Sai Prasad',
    'John Brownstein',
    'Gajen Sunthara',
    'Kerrie Holley',
    'Paul Nielsen',
    'Seth Berkeley',
    'Ivan Sini',
    'Salman Subakat',
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Dobeon Illustrations Showcase
          </h1>
          <p className="text-lg text-gray-600">
            Professional SVG illustrations for the Dobeon website
          </p>
        </div>

        {/* Hero Illustrations */}
        <section className="bg-white rounded-3xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Hero Illustrations</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="text-center">
              <HealthcareTech className="w-full max-w-md mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">Healthcare Tech</h3>
              <p className="text-gray-600 text-sm">Medical cross + tech elements</p>
            </div>
            <div className="text-center">
              <DataAnalytics className="w-full max-w-md mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">Data Analytics</h3>
              <p className="text-gray-600 text-sm">Charts, graphs, data visualization</p>
            </div>
            <div className="text-center">
              <TeamCollaboration className="w-full max-w-md mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">Team Collaboration</h3>
              <p className="text-gray-600 text-sm">People working together</p>
            </div>
            <div className="text-center">
              <Innovation className="w-full max-w-md mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">Innovation</h3>
              <p className="text-gray-600 text-sm">Lightbulb + gears</p>
            </div>
          </div>
        </section>

        {/* Service Icons */}
        <section className="bg-white rounded-3xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Service Icons</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-2xl">
              <AssessIcon size={100} className="mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Assess</h3>
              <p className="text-gray-600 text-sm">Magnifying glass + checklist</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-2xl">
              <IdentifyIcon size={100} className="mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Identify</h3>
              <p className="text-gray-600 text-sm">Target + analysis</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-2xl">
              <CloseIcon size={100} className="mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Close</h3>
              <p className="text-gray-600 text-sm">Checkmark + growth arrow</p>
            </div>
          </div>
        </section>

        {/* Team Avatars */}
        <section className="bg-white rounded-3xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Team Avatars</h2>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-6">
            {teamMembers.map((name) => (
              <div key={name} className="text-center">
                <TeamAvatar name={name} size={120} className="mx-auto mb-2 rounded-xl shadow-md" />
                <p className="text-xs text-gray-600 font-medium">{name.split(' ')[0]}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Decorative Elements */}
        <section className="bg-white rounded-3xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Decorative Elements</h2>

          <div className="space-y-8">
            {/* Grid Pattern */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Grid Pattern</h3>
              <div className="relative h-40 bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
                <GridPattern className="absolute inset-0" />
              </div>
            </div>

            {/* Wave Pattern */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Wave Pattern</h3>
              <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
                <WavePattern opacity={0.15} color="#0066ff" />
              </div>
            </div>

            {/* Abstract Shapes */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Abstract Shapes</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="relative h-40 bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
                  <AbstractShapes variant="circles" className="absolute inset-0" />
                  <div className="absolute bottom-2 left-2 bg-white/80 px-2 py-1 rounded text-xs font-semibold">
                    Circles
                  </div>
                </div>
                <div className="relative h-40 bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
                  <AbstractShapes variant="squares" className="absolute inset-0" />
                  <div className="absolute bottom-2 left-2 bg-white/80 px-2 py-1 rounded text-xs font-semibold">
                    Squares
                  </div>
                </div>
                <div className="relative h-40 bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
                  <AbstractShapes variant="mixed" className="absolute inset-0" />
                  <div className="absolute bottom-2 left-2 bg-white/80 px-2 py-1 rounded text-xs font-semibold">
                    Mixed
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Usage Info */}
        <section className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Usage Information</h2>
          <div className="space-y-2 text-gray-700">
            <p><strong>Colors:</strong> All illustrations use Dobeon brand colors (#0066ff, #3385ff, #0052cc)</p>
            <p><strong>Format:</strong> Pure SVG for scalability and performance</p>
            <p><strong>Style:</strong> Minimal, geometric, professional</p>
            <p><strong>Documentation:</strong> See <code className="bg-white px-2 py-1 rounded">/components/illustrations/README.md</code></p>
            <p><strong>Quick Guide:</strong> See <code className="bg-white px-2 py-1 rounded">/ILLUSTRATIONS_GUIDE.md</code></p>
          </div>
        </section>
      </div>
    </div>
  );
}
