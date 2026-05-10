"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { Loader2, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  registerSchema,
  UserRole,
  type UserRegisterInput,
  type OrgRegisterInput,
} from "@/lib/validations/auth";
import { useRegisterMutation } from "@/hooks/useAuthMutations";
import { useAuthStore } from "@/store/authStore";

type RegisterFormValues =
  | (Omit<UserRegisterInput, "role"> & { role: "USER" })
  | (Omit<OrgRegisterInput, "role"> & { role: "ORGANIZATION" });

export function RegisterForm() {
  const registerMutation = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const form = useForm({
    defaultValues: {
      role: "USER",
      email: "",
      password: "",
      phone: "",
      name: "",
      orgName: "",
      latitude: 0,
      longitude: 0,
      establishedYear: undefined,
      registrationNumber: "",
    } as RegisterFormValues,
    validators: {
      onSubmit: registerSchema,
    },
    onSubmit: async ({ value }: { value: RegisterFormValues }) => {
      registerMutation.mutate(value as UserRegisterInput | OrgRegisterInput);
    },
  });

  const role = form.getFieldValue("role");

  return (
    <div className="glass-panel-strong relative overflow-hidden rounded-[2.5rem] p-10 border-white/10 shadow-2xl">
      <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-secondary/10 blur-3xl" />
      
      <div className="relative z-10 space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black tracking-tight text-foreground">
            Join the Mission
          </h2>
          <p className="text-muted-foreground font-medium mt-2">
            Be part of the global Zero Hunger movement
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          {/* Role Selection */}
          <form.Field
            name="role"
            children={(field: any) => (
              <div className="space-y-3">
                <RadioGroup
                  value={field.state.value}
                  onValueChange={(value) =>
                    field.handleChange(value as "USER" | "ORGANIZATION")
                  }
                  className="flex bg-white/5 border border-white/10 rounded-full p-1"
                >
                  <div className="flex-1">
                    <RadioGroupItem
                      value={UserRole.USER}
                      id="user"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="user"
                      className="flex items-center justify-center py-2 rounded-full text-sm font-bold text-muted-foreground hover:text-foreground cursor-pointer transition-all peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=checked]:shadow-md"
                    >
                      Individual
                    </Label>
                  </div>
                  <div className="flex-1">
                    <RadioGroupItem
                      value={UserRole.ORGANIZATION}
                      id="organization"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="organization"
                      className="flex items-center justify-center py-2 rounded-full text-sm font-bold text-muted-foreground hover:text-foreground cursor-pointer transition-all peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=checked]:shadow-md"
                    >
                      Organization
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Conditional: Name for USER, OrgName for ORGANIZATION */}
            {role === "USER" ? (
              <form.Field
                name="name"
                children={(field: any) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name} className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      placeholder="John Doe"
                      autoComplete="name"
                      className="h-12 rounded-xl bg-white/5 border-white/10 focus:border-primary/50 transition-all"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={registerMutation.isPending}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-[10px] font-bold text-destructive mt-1 ml-1">
                        {field.state.meta.errors.join(", ")}
                      </p>
                    )}
                  </div>
                )}
              />
            ) : (
              <form.Field
                name="orgName"
                children={(field: any) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name} className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Organization Name</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      placeholder="Relief Foundation"
                      className="h-12 rounded-xl bg-white/5 border-white/10 focus:border-primary/50 transition-all"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={registerMutation.isPending}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-[10px] font-bold text-destructive mt-1 ml-1">
                        {field.state.meta.errors.join(", ")}
                      </p>
                    )}
                  </div>
                )}
              />
            )}

            <form.Field
              name="email"
              children={(field: any) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name} className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Email</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    placeholder="name@agency.org"
                    autoComplete="email"
                    className="h-12 rounded-xl bg-white/5 border-white/10 focus:border-primary/50 transition-all"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    disabled={registerMutation.isPending}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-[10px] font-bold text-destructive mt-1 ml-1">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  )}
                </div>
              )}
            />

            <form.Field
              name="phone"
              children={(field: any) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name} className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Phone</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="tel"
                    placeholder="+880 1XXX-XXXXXX"
                    autoComplete="tel"
                    className="h-12 rounded-xl bg-white/5 border-white/10 focus:border-primary/50 transition-all"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    disabled={registerMutation.isPending}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-[10px] font-bold text-destructive mt-1 ml-1">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  )}
                </div>
              )}
            />

            <form.Field
              name="password"
              children={(field: any) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name} className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Password</Label>
                  <div className="relative">
                    <Input
                      id={field.name}
                      name={field.name}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="h-12 rounded-xl bg-white/5 border-white/10 focus:border-primary/50 transition-all pr-12"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={registerMutation.isPending}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={registerMutation.isPending}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </Button>
                  </div>
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-[10px] font-bold text-destructive mt-1 ml-1">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
              <span className="bg-background px-4 text-muted-foreground/60">Location Details</span>
            </div>
          </div>

          {/* Location Fields */}
          <div className="grid grid-cols-2 gap-6">
            <form.Field
              name="latitude"
              children={(field: any) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name} className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Latitude</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    step="any"
                    placeholder="23.8103"
                    className="h-12 rounded-xl bg-white/5 border-white/10 focus:border-primary/50 transition-all"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(parseFloat(e.target.value) || 0)
                    }
                    disabled={registerMutation.isPending}
                  />
                </div>
              )}
            />

            <form.Field
              name="longitude"
              children={(field: any) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name} className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Longitude</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    step="any"
                    placeholder="90.4125"
                    className="h-12 rounded-xl bg-white/5 border-white/10 focus:border-primary/50 transition-all"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(parseFloat(e.target.value) || 0)
                    }
                    disabled={registerMutation.isPending}
                  />
                </div>
              )}
            />
          </div>

          {/* Optional Organization Fields */}
          {role === "ORGANIZATION" && (
            <div className="grid grid-cols-2 gap-6 p-6 rounded-2xl bg-primary/5 border border-primary/10">
                <form.Field
                  name="establishedYear"
                  children={(field: any) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name} className="text-xs font-black uppercase tracking-widest text-primary ml-1">
                        Established
                      </Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        placeholder="2010"
                        className="h-12 rounded-xl bg-background border-primary/20 focus:border-primary transition-all"
                        value={field.state.value || ""}
                        onBlur={field.handleBlur}
                        onChange={(e) =>
                          field.handleChange(
                            e.target.value ? parseInt(e.target.value) : undefined
                          )
                        }
                        disabled={registerMutation.isPending}
                      />
                    </div>
                  )}
                />

                <form.Field
                  name="registrationNumber"
                  children={(field: any) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name} className="text-xs font-black uppercase tracking-widest text-primary ml-1">
                        Reg. ID
                      </Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        placeholder="REG-9921"
                        className="h-12 rounded-xl bg-background border-primary/20 focus:border-primary transition-all"
                        value={field.state.value || ""}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        disabled={registerMutation.isPending}
                      />
                    </div>
                  )}
                />
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98]"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Registering...
              </>
            ) : (
              "Register"
            )}
          </Button>
        </form>

        <div className="pt-6 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            Already part of the movement?{" "}
            <Link
              href="/auth/login"
              className="text-primary font-black hover:underline underline-offset-4"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
