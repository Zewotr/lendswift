import { Link } from 'react-router-dom';
import {
  HiOutlineDocumentText,
  HiOutlineShieldCheck,
  HiOutlineClock,
  HiOutlineBadgeCheck,
} from 'react-icons/hi';

const loanProducts = [
  {
    title: 'Personal Loan',
    description: 'Get quick funds for travel, wedding, medical needs, or any personal expense. Flexible tenures up to 5 years.',
    icon: '💰',
    color: 'bg-blue-50 text-blue-700',
  },
  {
    title: 'Home Loan',
    description: 'Turn your dream home into reality. Attractive interest rates and easy EMI options with balance transfer facility.',
    icon: '🏠',
    color: 'bg-green-50 text-green-700',
  },
  {
    title: 'Business Loan',
    description: 'Fuel your business growth with collateral‑free loans. Minimum documentation and quick disbursal.',
    icon: '📈',
    color: 'bg-purple-50 text-purple-700',
  },
];

const features = [
  {
    icon: <HiOutlineClock className="h-6 w-6" />,
    title: 'Quick Decision',
    desc: 'Instant eligibility check and in‑principle approval within minutes.',
  },
  {
    icon: <HiOutlineShieldCheck className="h-6 w-6" />,
    title: '100% Secure',
    desc: 'Bank‑grade encryption for all your documents and personal data.',
  },
  {
    icon: <HiOutlineDocumentText className="h-6 w-6" />,
    title: 'Paperless Process',
    desc: 'Upload documents, sign electronically, and complete your application online.',
  },
  {
    icon: <HiOutlineBadgeCheck className="h-6 w-6" />,
    title: 'Dedicated Support',
    desc: 'Expert loan advisors to help you at every step of the application.',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-700 flex items-center justify-center border-gray-950 ">
              <span className="text-white font-bold text-xl">LS</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Lend<wbr/>Swift</span>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
            <a href="#products" className="hover:text-indigo-600 hover:bg-gray-100 px-3 py-1 rounded transition">Products</a>
            <a href="#features" className="hover:text-indigo-600 hover:bg-gray-100 px-3 py-1 rounded transition">Features</a>
            <a href="#about" className="hover:text-indigo-600 hover:bg-gray-100 px-3 py-1 rounded transition">About</a>
          </div>
          <Link
            to="/apply"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-700 text-white text-sm font-semibold hover:bg-green-500 transition shadow-sm"
          >
            Apply Now
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                New: Instant Approval
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                Loans made <span className="text-indigo-600">simple</span> & <span className="text-indigo-600">fast</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-lg">
                Apply for Personal, Home or Business loans online with a fully digital, paperless process. Get an instant eligibility decision in minutes.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/apply"
                  className="inline-flex items-center px-8 py-4 rounded-xl bg-indigo-600 text-white font-semibold text-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                >
                  Apply for a Loan
                  <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <a
                  href="#products"
                  className="inline-flex items-center px-8 py-4 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-indigo-300 transition"
                >
                  Explore Products
                </a>
              </div>
              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-2">
                  {[1,2,3].map((i) => (
                    <div key={i} className="h-8 w-8 rounded-full bg-gray-300 border-2 border-white" />
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-700">4,200+</span> happy customers
                </p>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="relative rounded-2xl bg-white shadow-2xl p-6 border border-gray-100">
                <div className="space-y-4">
                  <div className="h-8 bg-gray-100 rounded w-3/4" />
                  <div className="h-8 bg-gray-100 rounded w-1/2" />
                  <div className="h-8 bg-gray-100 rounded w-5/6" />
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="h-48 bg-indigo-50 rounded-lg" />
                    <div className="h-48 bg-indigo-50 rounded-lg" />
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 h-24 w-24 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl opacity-20 blur-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Loan Products */}
      <section id="products" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Choose your loan type</h2>
            <p className="mt-4 text-gray-600">Select the product that best fits your needs and start your application in seconds.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {loanProducts.map((product) => (
              <div
                key={product.title}
                className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition border border-gray-100 hover:border-indigo-100"
              >
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl text-2xl ${product.color}`}>
                  {product.icon}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">{product.title}</h3>
                <p className="mt-3 text-gray-600 leading-relaxed">{product.description}</p>
                <Link
                  to="/apply"
                  className="mt-6 inline-flex items-center text-indigo-600 font-medium group-hover:text-indigo-700 transition"
                >
                  Apply Now
                  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why apply with us</h2>
            <p className="mt-4 text-gray-600">A modern, hassle‑free loan experience designed for you.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="text-center p-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section id='about' className="py-20 bg-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white">Ready to get started?</h2>
          <p className="mt-4 text-indigo-100 text-lg">Complete your application in less than 10 minutes.</p>
          <Link
            to="/apply"
            className="mt-8 inline-flex items-center px-8 py-4 rounded-xl bg-white text-indigo-600 font-semibold text-lg hover:bg-gray-50 transition shadow-lg"
          >
            Start Your Application
            <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">&copy; 2026 LendSwift. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}