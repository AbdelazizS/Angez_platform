import { useForm } from 'react-hook-form';
import { router, Head } from '@inertiajs/react';
import { toast } from 'sonner';
import { 
  ChevronRight, ArrowLeft, Loader2, User, Globe, GraduationCap,
  MapPin, Clock, CircleDollarSign, CheckCircle, XCircle, Clock4,
  Sparkles, Target, Award, Briefcase, Zap, Shield, Star
} from 'lucide-react';
import {
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguageChange } from '@/lib/useLanguageChange';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export default function ProfileComplete({ user, skills, languages, availabilityStatuses, responseTimes }) {
  const { t } = useTranslation();
  const { isRTL } = useLanguageChange();
  const [step, setStep] = useState(0);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar || '');

  // Validation schema with localization
  const validationSchema = z.object({
    avatar: z.any().optional(),
    title: z.string().min(1, t('validation.required', 'This field is required')).max(255, t('validation.maxLength', 'Maximum 255 characters')),
    bio: z.string().min(1, t('validation.required', 'This field is required')).max(1000, t('validation.maxLength', 'Maximum 1000 characters')),
    skills: z.array(z.string()).min(1, t('validation.required', 'This field is required')),
    languages: z.array(z.string()).min(1, t('validation.required', 'This field is required')),
    hourly_rate: z.string().min(1, t('validation.required', 'This field is required')).refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: t('validation.numeric', 'Must be a valid number')
    }),
    location: z.string().min(1, t('validation.required', 'This field is required')).max(255, t('validation.maxLength', 'Maximum 255 characters')),
    website: z.string().optional(),
    education: z.string().optional(),
    availability_status: z.string().min(1, t('validation.required', 'This field is required')),
    response_time: z.string().min(1, t('validation.required', 'This field is required')).max(50, t('validation.maxLength', 'Maximum 50 characters')),
  });

  const form = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      avatar: null,
      title: user.freelancer_profile?.title || '',
      bio: user.freelancer_profile?.bio || '',
      skills: user.freelancer_profile?.skills || [],
      languages: user.freelancer_profile?.languages || [],
      hourly_rate: user.freelancer_profile?.hourly_rate || '1000',
      location: user.freelancer_profile?.location || '',
      website: user.freelancer_profile?.website || '',
      education: user.freelancer_profile?.education || '',
      availability_status: user.freelancer_profile?.availability_status || 'available',
      response_time: user.freelancer_profile?.response_time || '24 hours',
    }
  });

  const { handleSubmit, control, trigger, watch, setValue, formState: { errors } } = form;
  const [processing, setProcessing] = useState(false);

  const steps = [
    { 
      title: t('profileComplete.steps.basicInfo.title', 'Basic Information'), 
      subtitle: t('profileComplete.steps.basicInfo.subtitle', 'Tell us about yourself'),
      icon: <User className="w-5 h-5" />,
      fields: ['avatar', 'title', 'bio'] 
    },
    { 
      title: t('profileComplete.steps.skills.title', 'Skills & Expertise'), 
      subtitle: t('profileComplete.steps.skills.subtitle', 'Showcase your capabilities'),
      icon: <Target className="w-5 h-5" />,
      fields: ['skills', 'languages', 'hourly_rate'] 
    },
    { 
      title: t('profileComplete.steps.background.title', 'Background Details'), 
      subtitle: t('profileComplete.steps.background.subtitle', 'Share your experience'),
      icon: <Briefcase className="w-5 h-5" />,
      fields: ['location', 'website', 'education'] 
    },
    { 
      title: t('profileComplete.steps.availability.title', 'Availability Settings'), 
      subtitle: t('profileComplete.steps.availability.subtitle', 'Set your preferences'),
      icon: <Clock className="w-5 h-5" />,
      fields: ['availability_status', 'response_time'] 
    }
  ];

  // Enhanced TagInput with chips
  const TagInput = ({ value, onChange, placeholder, icon, maxTags = 10 }) => {
    const tags = Array.isArray(value) ? value : [];
    const [input, setInput] = useState('');
    
    const add = (e) => {
      e.preventDefault();
      const t = input.trim();
      if (t && !tags.includes(t) && tags.length < maxTags) {
        onChange([...tags, t]);
        setInput('');
      }
    };
    
    const remove = (t) => {
      onChange(tags.filter(x => x !== t));
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        add(e);
      }
    };

    return (
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            {icon && (
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                {React.cloneElement(icon, { className: "h-4 w-4" })}
              </div>
            )}
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            placeholder={placeholder}
              className={icon ? "pl-10" : ""}
            />
          </div>
          <Button 
            size="sm" 
            onClick={add}
            disabled={!input.trim() || tags.length >= maxTags}
            className="shrink-0"
          >
            {t('common.add', 'Add')}
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map(t => (
              <Badge 
                key={t} 
                variant="secondary"
                className="flex items-center gap-1 py-1 px-2 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                {icon && React.cloneElement(icon, { className: "h-3 w-3" })}
                {t}
                <button 
                  type="button" 
                  onClick={() => remove(t)}
                  className="ml-1 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <XCircle className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        {tags.length >= maxTags && (
          <p className="text-xs text-muted-foreground">
            {t('profileComplete.form.skills.maxTags', 'Maximum 15 tags allowed')}
          </p>
        )}
      </div>
    );
  };

  // Enhanced Avatar Upload with proper file handling
  const UploadAvatar = ({ preview, onChange }) => {
    const handleFileChange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        // Call the onChange callback with the file
        onChange(file);
      }
    };

    return (
      <div className="flex flex-col items-center gap-6">
        <div className="relative group">
          <Avatar className="w-32 h-32 border-4 border-background shadow-2xl ring-4 ring-primary/20">
          <AvatarImage src={preview} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-4xl font-bold">
              {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-16 h-16" />}
          </AvatarFallback>
        </Avatar>
          <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer">
            <div className="text-center text-white">
              <Sparkles className="w-6 h-6 mx-auto mb-1" />
              <span className="text-sm font-medium">{t('profileComplete.form.avatar.changePhoto', 'Change Photo')}</span>
        </div>
        <input 
          type="file" 
          accept="image/*" 
          className="hidden"
              onChange={handleFileChange}
        />
      </label>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {t('profileComplete.form.avatar.placeholder', 'Click to upload a professional photo')}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {t('profileComplete.form.avatar.recommendation', 'Recommended: Square image, 400x400px or larger')}
          </p>
        </div>
    </div>
  );
  };

  useEffect(() => {
    const file = watch('avatar');
    if (file && typeof file === 'object') {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [watch('avatar')]);

  const onSubmit = async (data) => {
    setProcessing(true);
    const fd = new FormData();
    
    // Handle file upload properly
    if (data.avatar && data.avatar instanceof File) {
      fd.append('avatar', data.avatar);
    }
    
    // Handle other form data
    Object.entries(data).forEach(([k, v]) => {
      if (k === 'avatar') {
        // Skip avatar as it's handled above
        return;
      } else if (Array.isArray(v)) {
        fd.append(k, JSON.stringify(v));
      } else {
        fd.append(k, v || '');
      }
    });

    try {
    await router.post(route('freelancer.profile.complete.submit'), fd, {
        onSuccess: () => {
          toast.success(t('profileComplete.validation.success', 'Profile completed successfully!'));
        },
        onError: (err) => {
          // Handle validation errors from server
          if (err && typeof err === 'object') {
            const errorMessages = Object.values(err).flat();
            if (errorMessages.length > 0) {
              toast.error(errorMessages.join(', '));
            } else {
              toast.error(t('profileComplete.validation.error', 'An error occurred. Please try again.'));
            }
          } else {
            toast.error(t('profileComplete.validation.error', 'An error occurred. Please try again.'));
          }
        },
      });
    } catch (error) {
      toast.error(t('profileComplete.validation.error', 'An error occurred. Please try again.'));
    } finally {
    setProcessing(false);
    }
  };

  const next = async () => {
    const currentStepFields = steps[step].fields;
    const isValid = await trigger(currentStepFields);
    
    if (isValid) {
      setStep(s => s + 1);
    } else {
      // Show validation errors for current step
      const currentErrors = Object.keys(errors).filter(key => currentStepFields.includes(key));
      if (currentErrors.length > 0) {
        const errorMessages = currentErrors.map(key => errors[key]?.message).filter(Boolean);
        toast.error(errorMessages.join(', '));
      } else {
        toast.warning(t('profileComplete.validation.completeFields', 'Please complete all required fields'));
      }
    }
  };

  return (
    <>
      <Head title={t('profileComplete.title', 'Complete Your Profile')} />
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-primary/10 rtl">
        {/* Header */}
        <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-primary-foreground" />
                </div>
            <div>
                  <h1 className="text-xl font-bold text-foreground">
                    {t('profileComplete.title', 'Complete Your Profile')}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {t('profileComplete.subtitle', 'Join thousands of successful freelancers')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>{t('profileComplete.secure', 'Secure & Private')}</span>
                </div>
              </div>
            </div>
          </div>
            </div>
            
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Progress Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {steps.map((s, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          i <= step 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
                        </div>
                        {i < steps.length - 1 && (
                          <div className={`w-12 h-0.5 ${
                            i < step ? 'bg-primary' : 'bg-muted'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">
                    {t('profileComplete.step', 'Step')} {step + 1} {t('profileComplete.of', 'of')} {steps.length}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {Math.round(((step + 1) / steps.length) * 100)}% {t('profileComplete.complete', 'complete')}
                  </div>
                </div>
              </div>
              <Progress value={((step + 1) / steps.length) * 100} className="h-2" />
            </div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Form */}
              <div className="lg:col-span-2">
                <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="pb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        {steps[step].icon}
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold text-foreground">
                          {steps[step].title}
                        </CardTitle>
                        <p className="text-muted-foreground mt-1">
                          {steps[step].subtitle}
                        </p>
            </div>
          </div>
                  </CardHeader>
                  <CardContent className="space-y-8">
          <Form {...form}>
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Step 1: Basic Info */}
              {step === 0 && (
                          <div className="space-y-8">
                  <FormField name="avatar" control={control} render={({ field }) => (
                    <FormItem>
                      <FormControl>
                                  <UploadAvatar 
                                    preview={avatarPreview} 
                                    onChange={(file) => {
                                      field.onChange(file);
                                      if (file && file instanceof File) {
                                        const url = URL.createObjectURL(file);
                                        setAvatarPreview(url);
                                      }
                                    }} 
                                  />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField name="title" control={control} render={({ field }) => (
                    <FormItem>
                                <FormLabel className="text-base font-semibold">
                                  {t('profileComplete.form.title.label', 'Professional Title')}
                                </FormLabel>
                      <FormControl>
                                  <Input 
                                    {...field} 
                                    placeholder={t('profileComplete.form.title.placeholder', 'e.g. Senior UX Designer, Full-Stack Developer')} 
                                    className="h-12 text-base"
                                  />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField name="bio" control={control} render={({ field }) => (
                    <FormItem>
                                <FormLabel className="text-base font-semibold">
                                  {t('profileComplete.form.bio.label', 'About You')}
                                </FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                                    rows={6} 
                                    placeholder={t('profileComplete.form.bio.placeholder', 'Tell clients about your experience, skills, and what you can offer. Be specific about your expertise and achievements...')} 
                                    className="text-base resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              )}

              {/* Step 2: Skills & Rates */}
              {step === 1 && (
                          <div className="space-y-8">
                  <FormField name="skills" control={control} render={({ field }) => (
                    <FormItem>
                                <FormLabel className="text-base font-semibold">
                                  {t('profileComplete.form.skills.label', 'Skills & Expertise')}
                                </FormLabel>
                      <FormControl>
                        <TagInput 
                          value={field.value} 
                          onChange={field.onChange} 
                                    placeholder={t('profileComplete.form.skills.placeholder', 'Add a skill (e.g. React, Figma, Python)')} 
                                    icon={<Target />}
                                    maxTags={15}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField name="languages" control={control} render={({ field }) => (
                    <FormItem>
                                <FormLabel className="text-base font-semibold">
                                  {t('profileComplete.form.languages.label', 'Languages')}
                                </FormLabel>
                      <FormControl>
                        <TagInput 
                          value={field.value} 
                          onChange={field.onChange} 
                                    placeholder={t('profileComplete.form.languages.placeholder', 'Add a language (e.g. English, Spanish, Arabic)')} 
                          icon={<Globe />}
                                    maxTags={8}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                          
                </div>
              )}

              {/* Step 3: Background */}
              {step === 2 && (
                          <div className="space-y-8">
                  <FormField name="location" control={control} render={({ field }) => (
                    <FormItem>
                                <FormLabel className="text-base font-semibold">
                                  {t('profileComplete.form.location.label', 'Location')}
                                </FormLabel>
                      <FormControl>
                        <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <MapPin className="h-5 w-5 text-muted-foreground" />
                          </div>
                                    <Input 
                                      {...field} 
                                      className="pl-12 h-12 text-base" 
                                      placeholder={t('profileComplete.form.location.placeholder', 'e.g. Khartoum, Sudan')} 
                                    />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                            

                  <FormField name="education" control={control} render={({ field }) => (
                    <FormItem>
                                <FormLabel className="text-base font-semibold">
                                  {t('profileComplete.form.education.label', 'Education')}
                                </FormLabel>
                      <FormControl>
                        <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <GraduationCap className="h-5 w-5 text-muted-foreground" />
                          </div>
                                    <Input 
                                      {...field} 
                                      className="pl-12 h-12 text-base" 
                                      placeholder={t('profileComplete.form.education.placeholder', 'e.g. University of Khartoum, Computer Science')} 
                                    />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              )}

              {/* Step 4: Availability */}
              {step === 3 && (
                          <div className="space-y-8">
                  <FormField name="availability_status" control={control} render={({ field }) => (
                    <FormItem>
                                <FormLabel className="text-base font-semibold">
                                  {t('profileComplete.form.availability.label', 'Availability Status')}
                                </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                                    <SelectTrigger className="h-12 text-base rtl">
                                      <SelectValue placeholder={t('profileComplete.form.availability.placeholder', 'Select your availability')} />
                          </SelectTrigger>
                        </FormControl>
                                  <SelectContent className="rtl" >
                          <SelectItem value="available">
                                      <div className="flex items-center gap-3 py-1">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        <div>
                                          <div className="font-medium">
                                            {t('profileComplete.form.availability.available.label', 'Available')}
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            {t('profileComplete.form.availability.available.description', 'Ready for new projects')}
                                          </div>
                                        </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="busy">
                                      <div className="flex items-center gap-3 py-1">
                                        <Clock4 className="h-5 w-5 text-yellow-500" />
                                        <div>
                                          <div className="font-medium">
                                            {t('profileComplete.form.availability.busy.label', 'Busy')}
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            {t('profileComplete.form.availability.busy.description', 'Limited availability')}
                                          </div>
                                        </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="unavailable">
                                      <div className="flex items-center gap-3 py-1">
                                        <XCircle className="h-5 w-5 text-red-500" />
                                        <div>
                                          <div className="font-medium">
                                            {t('profileComplete.form.availability.unavailable.label', 'Unavailable')}
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            {t('profileComplete.form.availability.unavailable.description', 'Not taking new projects')}
                                          </div>
                                        </div>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField name="response_time" control={control} render={({ field }) => (
                    <FormItem>
                                <FormLabel className="text-base font-semibold">
                                  {t('profileComplete.form.responseTime.label', 'Response Time')}
                                </FormLabel>
                      <FormControl>
                                  <Input 
                                    {...field} 
                                    placeholder={t('profileComplete.form.responseTime.placeholder', 'e.g. Within 24 hours, Within 2 hours')} 
                                    className="h-12 text-base"
                                  />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              )}

              {/* Navigation Buttons */}
                        <div className="flex justify-between gap-4 pt-8 border-t">
                {step > 0 ? (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setStep(s => s - 1)}
                              className="gap-2 h-12 px-6"
                  >
                              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                              {t('profileComplete.navigation.previous', 'Previous')}
                  </Button>
                ) : (
                            <div></div>
                )}

                {step < steps.length - 1 ? (
                  <Button 
                    type="button" 
                    onClick={next}
                              className="gap-2 h-12 px-6 ml-auto"
                  >
                              {t('profileComplete.navigation.continue', 'Continue')}
                              <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    disabled={processing}
                              className="gap-2 h-12 px-6 ml-auto"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                                  {t('profileComplete.navigation.saving', 'Completing Profile...')}
                      </>
                    ) : (
                                <>
                                  <Zap className="h-4 w-4 " />
                                  {t('profileComplete.navigation.completeProfile', 'Complete Profile')}
                                </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Form>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Benefits & Tips */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Benefits Card */}
                  <Card className="shadow-lg border-0 bg-gradient-to-br from-primary/5 to-primary/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Star className="w-5 h-5 text-primary" />
                        {t('profileComplete.benefits.title', 'Why Complete Your Profile?')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            {t('profileComplete.benefits.visibility.title', 'Higher Visibility')}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {t('profileComplete.benefits.visibility.description', 'Complete profiles rank higher in search results')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                          <CheckCircle className="w-3 h-3 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            {t('profileComplete.benefits.projects.title', 'More Projects')}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {t('profileComplete.benefits.projects.description', 'Clients prefer detailed profiles')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                          <CheckCircle className="w-3 h-3 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            {t('profileComplete.benefits.rates.title', 'Better Rates')}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {t('profileComplete.benefits.rates.description', 'Professional profiles command higher rates')}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tips Card */}
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Sparkles className="w-5 h-5 text-primary" />
                        {t('profileComplete.tips.title', 'Pro Tips')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        <div className="font-medium text-foreground mb-1">
                          {t('profileComplete.tips.specific.title', 'Be Specific')}
                        </div>
                        <div>{t('profileComplete.tips.specific.description', 'Include specific skills, technologies, and achievements')}</div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <div className="font-medium text-foreground mb-1">
                          {t('profileComplete.tips.results.title', 'Show Results')}
                        </div>
                        <div>{t('profileComplete.tips.results.description', 'Mention measurable outcomes from past projects')}</div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <div className="font-medium text-foreground mb-1">
                          {t('profileComplete.tips.photo.title', 'Professional Photo')}
                        </div>
                        <div>{t('profileComplete.tips.photo.description', 'Use a clear, professional headshot')}</div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Progress Stats */}
                  <Card className="shadow-lg border-0">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary mb-1">
                          {Math.round(((step + 1) / steps.length) * 100)}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {t('profileComplete.profileCompletion', 'Profile Completion')}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}