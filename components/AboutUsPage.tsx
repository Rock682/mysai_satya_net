import React from 'react';
import { BriefcaseIcon, GiftIcon, AcademicCapIcon, UserCircleIcon } from './IconComponents';

const StatCard: React.FC<{ Icon: React.FC<any>, title: string, children: React.ReactNode }> = ({ Icon, title, children }) => (
    <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-lg border border-gray-200 dark:border-slate-700">
        <Icon className="h-10 w-10 text-green-600 mb-3" />
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{children}</p>
    </div>
);

const AboutUsPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto animate-fade-in-up">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-5xl">About Sai Satya Net</h1>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
                    Connecting Our Community, One Service at a Time.
                </p>
            </header>

            <main className="space-y-16">
                {/* Our Story Section */}
                <section>
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm">
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Our Story</h2>
                        <div className="text-gray-700 dark:text-gray-300 space-y-4 leading-relaxed">
                            <p>
                                Founded in 2012, Sai Satya Net began with a simple yet powerful vision: to bridge the digital and service gap in Garividi, Vizianagaram. We started as a small internet café, but quickly realized our community needed more. They needed a reliable place for essential services—from job applications and official document assistance to travel bookings and financial services.
                            </p>
                            <p>
                                Over the years, we've grown alongside our community, expanding our offerings to become a trusted one-stop solution. Whether it's helping a student prepare for exams, assisting a citizen with their PAN card, or creating a personalized gift for a special occasion, our core mission has remained the same: to provide accessible, reliable, and friendly service to everyone who walks through our doors.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Meet the Founder Section */}
                <section>
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-center gap-8">
                        <div className="flex-shrink-0">
                           <UserCircleIcon className="h-32 w-32 text-gray-300 dark:text-slate-600" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Meet the Founder</h2>
                            <p className="text-xl text-green-700 dark:text-green-400 font-semibold mt-1 mb-3">A.Satya Narayana</p>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                "Our goal was never just to be a business, but to be a pillar of support for our community. Every service we add, every person we help, is a step towards strengthening the place we call home. We believe in empowering people through technology and accessible services, and we are proud to serve the people of Garividi."
                            </p>
                        </div>
                    </div>
                </section>

                {/* Our Mission Section */}
                <section>
                    <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">What We Stand For</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <StatCard Icon={BriefcaseIcon} title="Empowering Careers">
                            Providing comprehensive support for job seekers, from application assistance to exam preparation, helping build a brighter future for our local talent.
                        </StatCard>
                        <StatCard Icon={GiftIcon} title="Celebrating Moments">
                            Offering unique, personalized gift articles that help our customers celebrate life's special moments with creativity and heart.
                        </StatCard>
                        <StatCard Icon={AcademicCapIcon} title="Accessible Services">
                            Making essential government, financial, and travel services simple and accessible to every member of our community, ensuring no one is left behind.
                        </StatCard>
                    </div>
                </section>
            </main>
        </div>
    );
};

const style = document.createElement('style');
if (!document.getElementById('about-us-styles')) {
    style.id = 'about-us-styles';
    style.textContent = `
      @keyframes fade-in-up {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in-up {
        animation: fade-in-up 0.5s ease-out forwards;
      }
    `;
    document.head.appendChild(style);
}

export default AboutUsPage;
