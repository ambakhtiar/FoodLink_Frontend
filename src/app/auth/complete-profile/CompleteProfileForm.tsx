"use client";

import { useForm } from "@tanstack/react-form";
import { Loader2, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCompleteProfileMutation } from "@/hooks/useAuthMutations";
import { FULL_APP_NAME } from "@/lib/constants";

export default function CompleteProfileForm() {
    const completeProfileMutation = useCompleteProfileMutation();

    const form = useForm({
        defaultValues: {
            phone: "+8801",
            latitude: 0,
            longitude: 0,
        },
        onSubmit: async ({ value }) => {
            completeProfileMutation.mutate(value);
        },
    });

    const handleGetLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                form.setFieldValue("latitude", position.coords.latitude);
                form.setFieldValue("longitude", position.coords.longitude);
            });
        }
    };

    return (
        <div className="glass-panel-strong relative overflow-hidden rounded-[2.5rem] p-10 border-white/10 shadow-2xl">
            <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative z-10 space-y-6">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black tracking-tight text-foreground">
                        Finish Setup
                    </h2>
                    <p className="text-muted-foreground font-medium mt-2">
                        Just a few more details to get started with {FULL_APP_NAME}
                    </p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }} className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Phone Number</Label>
                        <form.Field
                            name="phone"
                            children={(field) => (
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input 
                                        placeholder="+8801XXXXXXXXX" 
                                        className="h-14 pl-12 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 text-lg"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val.startsWith("+8801") && val.length <= 14) {
                                                field.handleChange(val);
                                            } else if (val.length < 5) {
                                                field.handleChange("+8801");
                                            }
                                        }}
                                        required
                                    />
                                </div>
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Location</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <form.Field
                                name="latitude"
                                children={(field) => (
                                    <Input 
                                        type="number"
                                        step="any"
                                        placeholder="Lat" 
                                        className="h-14 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(parseFloat(e.target.value))}
                                        required
                                    />
                                )}
                            />
                            <form.Field
                                name="longitude"
                                children={(field) => (
                                    <Input 
                                        type="number"
                                        step="any"
                                        placeholder="Long" 
                                        className="h-14 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(parseFloat(e.target.value))}
                                        required
                                    />
                                )}
                            />
                        </div>
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={handleGetLocation}
                            className="w-full h-10 rounded-xl border-white/10 gap-2 font-bold"
                        >
                            <MapPin className="h-4 w-4" />
                            Use Current Location
                        </Button>
                    </div>

                    <Button 
                        className="w-full h-14 rounded-2xl bg-primary font-black uppercase tracking-widest"
                        disabled={completeProfileMutation.isPending}
                    >
                        {completeProfileMutation.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : "Complete Profile"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
