import { Metadata } from "next";


export const metadata: Metadata = {
    title: "Updates | Pseudo Memories",
    description: "Exhibition history and updates",
};

const exhibitions = [
    {
        id: 1,
        title: "Hacking Kracking #2",
        location: "Krack! Studio",
        description: "Collaboration with Oik Wasfuk",
        date: "2024",
        year: 2024
    },
    {
        id: 2,
        title: "Studio Affair",
        location: "Krack! Studio",
        description: "",
        date: "Nov 2023",
        year: 2023
    },
    {
        id: 3,
        title: "Mini Print Fair",
        location: "Black Hand Gang",
        description: "",
        date: "18 Jun 2023",
        year: 2023
    },
    {
        id: 4,
        title: "Greeting From Paradise Paradox",
        location: "Krack! Studio",
        description: "",
        date: "Jan 2022",
        year: 2022
    },
    {
        id: 5,
        title: "Pekan Seni Grafis Yogyakarta",
        location: "Kiniko Art",
        description: "",
        date: "21 Sep 2021",
        year: 2021
    },
    {
        id: 6,
        title: "In a Landscape",
        location: "A# gallery",
        description: "Solo Exhibition",
        date: "May 2020",
        year: 2020
    },
    {
        id: 7,
        title: "Macam-macam",
        location: "RED BASE",
        description: "Group Exhibition",
        date: "29 Oct 2019",
        year: 2019
    },
    {
        id: 8,
        title: "Gambar Umbul",
        location: "Krack! Studio",
        description: "Group Exhibition",
        date: "23 Jul 2019",
        year: 2019
    },
    {
        id: 9,
        title: "Either Together Whatever",
        location: "MES 56",
        description: "K 17th anniversary, group exhibition",
        date: "28 Feb 2019",
        year: 2019
    },
    {
        id: 10,
        title: "Mini Print Jogja Biennale",
        location: "",
        description: "",
        date: "20 Nov 2018",
        year: 2018
    }
];

export default function UpdatesPage() {
    return (
        <main className="relative min-h-screen w-full bg-background">

            <div className="relative z-0 min-h-screen flex items-center justify-center px-8 py-8">
                <div className="max-w-4xl w-full">
                    {/* Header */}
                    <div className="mb-16">
                        <h1 className="font-electrolize text-h3 sm:text-h2 uppercase tracking-wider text-white mb-4">
                            Updates
                        </h1>
                        <p className="font-doto text-caption text-white/60 uppercase tracking-widest">
                            Exhibition History & Information
                        </p>
                    </div>

                    {/* Exhibition List */}
                    <div className="space-y-1 ">
                        {exhibitions.map((exhibition, index) => (
                            <div
                                key={exhibition.id}
                                className="group border-t border-white/10 py-6 hover:bg-white/5 transition-all px-6"
                            >
                                <div className="flex items-start justify-between gap-6 ">
                                    <div className="flex-1">
                                        <div className="flex items-baseline gap-4 mb-2">
                                            <span className="font-doto text-micro text-white/40 uppercase tracking-widest">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <h3 className="font-electrolize text-body uppercase tracking-wider text-white group-hover:text-vermelion-200 transition-colors">
                                                {exhibition.title}
                                            </h3>
                                        </div>
                                        <div className="ml-8 space-y-1">
                                            {exhibition.location && (
                                                <p className="font-doto text-caption text-white/60 uppercase tracking-widest">
                                                    {exhibition.location}
                                                </p>
                                            )}
                                            {exhibition.description && (
                                                <p className="font-doto text-caption text-white/50">
                                                    {exhibition.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-doto text-caption text-white/60 uppercase tracking-widest">
                                            {exhibition.date}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom border */}
                    <div className="border-t border-white/10 mt-1 pb-24" />
                </div>
            </div>

            {/* Bottom gradient mask */}
            <div className="fixed bottom-0 left-0 right-0 h-48 bg-linear-to-t from-background via-background/90 to-transparent pointer-events-none z-10" />
        </main>
    );
}
