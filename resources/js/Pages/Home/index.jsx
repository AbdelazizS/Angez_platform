import { Head } from "@inertiajs/react";
import Navbar from "@/components/Home/Navbar";
import Hero from "@/components/Home/Hero";
import Services from "@/components/Home/Services";
import HowItWorks from "@/components/Home/HowItWorks";
import Features from "@/components/Home/Features";
import Footer from "@/components/Home/Footer";
import VideoSection from "@/components/Home/VideoSection";

export default function Home({ auth }) {
    return (
        <>
            <Head title="Sudanese Freelance Marketplace" />

            {/* Hero Section with Fixed Navbar */}
            <Navbar auth={auth} />
            <Hero auth={auth} />
            <VideoSection /> {/* Added after Hero */}

            <Services />
            <HowItWorks />
            <Features />
            <Footer />
        </>
    );
}
