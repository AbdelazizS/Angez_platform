import { Head } from "@inertiajs/react";
import Navbar from "@/Components/Home/Navbar";
import Hero from "@/Components/Home/Hero";
import Services from "@/Components/Home/Services";
import HowItWorks from "@/Components/Home/HowItWorks";
import Features from "@/Components/Home/Features";
import Footer from "@/Components/Home/Footer";
import VideoSection from "@/Components/Home/VideoSection";

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
