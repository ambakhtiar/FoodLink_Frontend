"use client";

import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  registerSchema,
  UserRole,
  type UserRegisterInput,
  type OrgRegisterInput,
} from "@/lib/validations/auth";
import { useRegisterMutation } from "@/hooks/useAuthMutations";

type RegisterFormValues =
  | (Omit<UserRegisterInput, "role"> & { role: "USER" })
  | (Omit<OrgRegisterInput, "role"> & { role: "ORGANIZATION" });

export default function RegisterPage() {
  const registerMutation = useRegisterMutation();

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
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Account Category</Label>
                <RadioGroup
                  value={field.state.value}
                  onValueChange={(value) =>
                    field.handleChange(value as "USER" | "ORGANIZATION")
                  }
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem
                      value={UserRole.USER}
                      id="user"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="user"
                      className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-white/5 bg-white/5 p-6 hover:bg-white/10 transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer group"
                    >
                      <span className="font-bold text-lg group-hover:scale-110 transition-transform">Individual</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                        Donate Food
                      </span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value={UserRole.ORGANIZATION}
                      id="organization"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="organization"
                      className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-white/5 bg-white/5 p-6 hover:bg-white/10 transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer group"
                    >
                      <span className="font-bold text-lg group-hover:scale-110 transition-transform">Organization</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                        Receive Relief
                      </span>
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
                    <Label htmlFor={field.name} className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Full Legal Name</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      placeholder="John Doe"
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
                    <Label htmlFor={field.name} className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Organization Title</Label>
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
                  <Label htmlFor={field.name} className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    placeholder="name@agency.org"
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
                  <Label htmlFor={field.name} className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Primary Contact</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="tel"
                    placeholder="+880 1XXX-XXXXXX"
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
                  <Label htmlFor={field.name} className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Security Code</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="password"
                    placeholder="••••••••"
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
          </div>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
              <span className="bg-background px-4 text-muted-foreground/60">Geo-Location Data</span>
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
                Registering Account...
              </>
            ) : (
              "Initialize Membership"
            )}
          </Button>
        </form>

        <div className="pt-6 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            Already part of the movement?{" "}
            <Link
              href="/login"
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

