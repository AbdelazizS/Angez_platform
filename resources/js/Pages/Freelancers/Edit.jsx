import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { 
    Save, 
    Upload, 
    X, 
    Plus, 
    Trash2, 
    Award, 
    Globe, 
    MapPin,
    Mail,
    Phone,
    User,
    Briefcase,
    GraduationCap,
    Languages
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Label } from '@/Components/ui/label';
import { Badge } from '@/Components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Switch } from '@/Components/ui/switch';
import Navbar from '@/Components/Home/Navbar';
import Footer from '@/Components/Home/Footer';

export default function FreelancerEdit({ freelancer, auth }) {
    const { data, setData, post, processing, errors } = useForm({
        // Basic Information
        name: freelancer.name || '',
        title: freelancer.title || '',
        bio: freelancer.bio || '',
        location: freelancer.location || '',
        email: freelancer.email || '',
        phone: freelancer.phone || '',
        website: freelancer.website || '',
        
        // Skills & Languages
        skills: freelancer.skills || [],
        languages: freelancer.languages || [],
        
        // Education & Certifications
        education: freelancer.education || '',
        certifications: freelancer.certifications || [],
        
        // Availability
        isAvailable: freelancer.isAvailable !== false,
        responseTime: freelancer.responseTime || '24 hours',
        
        // Portfolio
        portfolio: freelancer.portfolio || []
    });

    const [newSkill, setNewSkill] = useState('');
    const [newLanguage, setNewLanguage] = useState('');
    const [newCertification, setNewCertification] = useState('');
    const [newPortfolioItem, setNewPortfolioItem] = useState({
        title: '',
        description: '',
        category: '',
        link: ''
    });

    const handleAddSkill = () => {
        if (newSkill.trim() && !data.skills.includes(newSkill.trim())) {
            setData('skills', [...data.skills, newSkill.trim()]);
            setNewSkill('');
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setData('skills', data.skills.filter(skill => skill !== skillToRemove));
    };

    const handleAddLanguage = () => {
        if (newLanguage.trim() && !data.languages.includes(newLanguage.trim())) {
            setData('languages', [...data.languages, newLanguage.trim()]);
            setNewLanguage('');
        }
    };

    const handleRemoveLanguage = (languageToRemove) => {
        setData('languages', data.languages.filter(language => language !== languageToRemove));
    };

    const handleAddCertification = () => {
        if (newCertification.trim() && !data.certifications.includes(newCertification.trim())) {
            setData('certifications', [...data.certifications, newCertification.trim()]);
            setNewCertification('');
        }
    };

    const handleRemoveCertification = (certToRemove) => {
        setData('certifications', data.certifications.filter(cert => cert !== certToRemove));
    };

    const handleAddPortfolioItem = () => {
        if (newPortfolioItem.title.trim() && newPortfolioItem.description.trim()) {
            setData('portfolio', [...data.portfolio, { ...newPortfolioItem, id: Date.now() }]);
            setNewPortfolioItem({ title: '', description: '', category: '', link: '' });
        }
    };

    const handleRemovePortfolioItem = (itemId) => {
        setData('portfolio', data.portfolio.filter(item => item.id !== itemId));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('freelancers.profile.update'));
    };

    const skillCategories = [
        'Web Development', 'Mobile Development', 'Graphic Design', 'Content Writing',
        'Digital Marketing', 'Translation', 'Video Editing', 'Data Entry',
        'UI/UX Design', 'SEO', 'Social Media', 'E-commerce'
    ];

    const languageOptions = [
        'Arabic', 'English', 'French', 'Spanish', 'German', 'Chinese', 'Japanese', 'Korean'
    ];

    return (
        <>
            <Head title="Edit Profile - Freelancer" />
            {/* <Navbar auth={auth} /> */}

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Edit Profile
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Update your profile information to attract more clients
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <Tabs defaultValue="basic" className="space-y-6">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                                    <TabsTrigger value="skills">Skills</TabsTrigger>
                                    <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                                    <TabsTrigger value="settings">Settings</TabsTrigger>
                                </TabsList>

                                {/* Basic Information Tab */}
                                <TabsContent value="basic" className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <User className="w-5 h-5" />
                                                Basic Information
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            {/* Profile Picture */}
                                            <div className="flex items-center gap-6">
                                                <Avatar className="w-24 h-24">
                                                    <AvatarImage src={freelancer.avatar} />
                                                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl font-bold">
                                                        {data.name.split(' ').map(n => n[0]).join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <Button type="button" variant="outline" size="sm">
                                                        <Upload className="w-4 h-4 mr-2" />
                                                        Upload Photo
                                                    </Button>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        JPG, PNG or GIF. Max size 2MB.
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Name and Title */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="name">Full Name</Label>
                                                    <Input
                                                        id="name"
                                                        value={data.name}
                                                        onChange={(e) => setData('name', e.target.value)}
                                                        placeholder="Your full name"
                                                        className={errors.name ? 'border-red-500' : ''}
                                                    />
                                                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                                </div>
                                                <div>
                                                    <Label htmlFor="title">Professional Title</Label>
                                                    <Input
                                                        id="title"
                                                        value={data.title}
                                                        onChange={(e) => setData('title', e.target.value)}
                                                        placeholder="e.g., Senior Web Developer"
                                                        className={errors.title ? 'border-red-500' : ''}
                                                    />
                                                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                                                </div>
                                            </div>

                                            {/* Bio */}
                                            <div>
                                                <Label htmlFor="bio">Bio</Label>
                                                <Textarea
                                                    id="bio"
                                                    value={data.bio}
                                                    onChange={(e) => setData('bio', e.target.value)}
                                                    placeholder="Tell clients about yourself, your experience, and what you can offer..."
                                                    rows={4}
                                                    className={errors.bio ? 'border-red-500' : ''}
                                                />
                                                {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
                                            </div>

                                            {/* Location and Contact */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <Label htmlFor="location">Location</Label>
                                                    <div className="relative">
                                                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                        <Input
                                                            id="location"
                                                            value={data.location}
                                                            onChange={(e) => setData('location', e.target.value)}
                                                            placeholder="City, Country"
                                                            className="pl-10"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label htmlFor="email">Email</Label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                        <Input
                                                            id="email"
                                                            type="email"
                                                            value={data.email}
                                                            onChange={(e) => setData('email', e.target.value)}
                                                            placeholder="your@email.com"
                                                            className="pl-10"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label htmlFor="phone">Phone</Label>
                                                    <div className="relative">
                                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                        <Input
                                                            id="phone"
                                                            value={data.phone}
                                                            onChange={(e) => setData('phone', e.target.value)}
                                                            placeholder="+249 XXX XXX XXX"
                                                            className="pl-10"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Website */}
                                            <div>
                                                <Label htmlFor="website">Website</Label>
                                                <div className="relative">
                                                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                    <Input
                                                        id="website"
                                                        value={data.website}
                                                        onChange={(e) => setData('website', e.target.value)}
                                                        placeholder="https://yourwebsite.com"
                                                        className="pl-10"
                                                    />
                                                </div>
                                            </div>

                                            {/* Education */}
                                            <div>
                                                <Label htmlFor="education">Education</Label>
                                                <div className="relative">
                                                    <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                    <Input
                                                        id="education"
                                                        value={data.education}
                                                        onChange={(e) => setData('education', e.target.value)}
                                                        placeholder="e.g., Bachelor of Computer Science, University of Khartoum"
                                                        className="pl-10"
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Skills Tab */}
                                <TabsContent value="skills" className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Briefcase className="w-5 h-5" />
                                                Skills & Languages
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            {/* Skills */}
                                            <div>
                                                <Label>Skills & Expertise</Label>
                                                <div className="flex flex-wrap gap-2 mt-2 mb-4">
                                                    {data.skills.map((skill, index) => (
                                                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                                            {skill}
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveSkill(skill)}
                                                                className="ml-1 hover:text-red-500"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </Badge>
                                                    ))}
                                                </div>
                                                <div className="flex gap-2">
                                                    <Input
                                                        value={newSkill}
                                                        onChange={(e) => setNewSkill(e.target.value)}
                                                        placeholder="Add a skill"
                                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                                                    />
                                                    <Button type="button" onClick={handleAddSkill} size="sm">
                                                        <Plus className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Languages */}
                                            <div>
                                                <Label>Languages</Label>
                                                <div className="flex flex-wrap gap-2 mt-2 mb-4">
                                                    {data.languages.map((language, index) => (
                                                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                                                            {language}
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveLanguage(language)}
                                                                className="ml-1 hover:text-red-500"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </Badge>
                                                    ))}
                                                </div>
                                                <div className="flex gap-2">
                                                    <Select value={newLanguage} onValueChange={setNewLanguage}>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select language" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {languageOptions.map((lang) => (
                                                                <SelectItem key={lang} value={lang}>
                                                                    {lang}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <Button type="button" onClick={handleAddLanguage} size="sm">
                                                        <Plus className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Certifications */}
                                            <div>
                                                <Label>Certifications</Label>
                                                <div className="flex flex-wrap gap-2 mt-2 mb-4">
                                                    {data.certifications.map((cert, index) => (
                                                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                                            <Award className="w-3 h-3" />
                                                            {cert}
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveCertification(cert)}
                                                                className="ml-1 hover:text-red-500"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </Badge>
                                                    ))}
                                                </div>
                                                <div className="flex gap-2">
                                                    <Input
                                                        value={newCertification}
                                                        onChange={(e) => setNewCertification(e.target.value)}
                                                        placeholder="Add certification"
                                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCertification())}
                                                    />
                                                    <Button type="button" onClick={handleAddCertification} size="sm">
                                                        <Plus className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Portfolio Tab */}
                                <TabsContent value="portfolio" className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Portfolio</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            {/* Existing Portfolio Items */}
                                            {data.portfolio.length > 0 && (
                                                <div className="grid gap-4">
                                                    {data.portfolio.map((item) => (
                                                        <div key={item.id} className="border rounded-lg p-4">
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <h4 className="font-semibold">{item.title}</h4>
                                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                                        {item.description}
                                                                    </p>
                                                                    {item.category && (
                                                                        <Badge variant="outline" className="mt-2">
                                                                            {item.category}
                                                                        </Badge>
                                                                    )}
                                                                    {item.link && (
                                                                        <a 
                                                                            href={item.link} 
                                                                            target="_blank" 
                                                                            rel="noopener noreferrer"
                                                                            className="text-blue-600 hover:underline text-sm block mt-2"
                                                                        >
                                                                            View Project
                                                                        </a>
                                                                    )}
                                                                </div>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleRemovePortfolioItem(item.id)}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Add New Portfolio Item */}
                                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                                                <h4 className="font-semibold mb-4">Add Portfolio Item</h4>
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <Label>Project Title</Label>
                                                            <Input
                                                                value={newPortfolioItem.title}
                                                                onChange={(e) => setNewPortfolioItem({...newPortfolioItem, title: e.target.value})}
                                                                placeholder="Project name"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>Category</Label>
                                                            <Select 
                                                                value={newPortfolioItem.category} 
                                                                onValueChange={(value) => setNewPortfolioItem({...newPortfolioItem, category: value})}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select category" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {skillCategories.map((category) => (
                                                                        <SelectItem key={category} value={category}>
                                                                            {category}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Label>Description</Label>
                                                        <Textarea
                                                            value={newPortfolioItem.description}
                                                            onChange={(e) => setNewPortfolioItem({...newPortfolioItem, description: e.target.value})}
                                                            placeholder="Describe your project..."
                                                            rows={3}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>Project Link (Optional)</Label>
                                                        <Input
                                                            value={newPortfolioItem.link}
                                                            onChange={(e) => setNewPortfolioItem({...newPortfolioItem, link: e.target.value})}
                                                            placeholder="https://project-url.com"
                                                        />
                                                    </div>
                                                    <Button type="button" onClick={handleAddPortfolioItem}>
                                                        <Plus className="w-4 h-4 mr-2" />
                                                        Add to Portfolio
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Settings Tab */}
                                <TabsContent value="settings" className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Availability & Settings</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <Label>Available for Work</Label>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        Show clients that you're available for new projects
                                                    </p>
                                                </div>
                                                <Switch
                                                    checked={data.isAvailable}
                                                    onCheckedChange={(checked) => setData('isAvailable', checked)}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="responseTime">Response Time</Label>
                                                <Select 
                                                    value={data.responseTime} 
                                                    onValueChange={(value) => setData('responseTime', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="1 hour">1 hour</SelectItem>
                                                        <SelectItem value="2 hours">2 hours</SelectItem>
                                                        <SelectItem value="4 hours">4 hours</SelectItem>
                                                        <SelectItem value="8 hours">8 hours</SelectItem>
                                                        <SelectItem value="24 hours">24 hours</SelectItem>
                                                        <SelectItem value="48 hours">48 hours</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>

                            {/* Save Button */}
                            <div className="flex justify-end mt-8">
                                <Button type="submit" disabled={processing} className="min-w-[120px]">
                                    {processing ? (
                                        'Saving...'
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
} 