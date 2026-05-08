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
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Create an account
        </CardTitle>
        <CardDescription className="text-center">
          Join FoodLink to reduce food waste
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          {/* Role Selection */}
          <form.Field
            name="role"
            children={(field: any) => (
              <div className="space-y-2">
                <Label>I want to join as</Label>
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
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <span className="font-semibold">Individual</span>
                      <span className="text-xs text-muted-foreground">
                        Donate food
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
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <span className="font-semibold">Organization</span>
                      <span className="text-xs text-muted-foreground">
                        Receive donations
                      </span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          />

          {/* Conditional: Name for USER, OrgName for ORGANIZATION */}
          {role === "USER" ? (
            <form.Field
              name="name"
              children={(field: any) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Full Name</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    placeholder="Enter your full name"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    disabled={registerMutation.isPending}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-500">
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
                  <Label htmlFor={field.name}>Organization Name</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    placeholder="Enter organization name"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    disabled={registerMutation.isPending}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-500">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  )}
                </div>
              )}
            />
          )}

          {/* Common Fields */}
          <form.Field
            name="email"
            children={(field: any) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Email</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  placeholder="Enter email address"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={registerMutation.isPending}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500">
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
                <Label htmlFor={field.name}>Password</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  placeholder="Create password (min 6 characters)"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={registerMutation.isPending}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500">
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
                <Label htmlFor={field.name}>Phone Number</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="tel"
                  placeholder="Enter phone number"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={registerMutation.isPending}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500">
                    {field.state.meta.errors.join(", ")}
                  </p>
                )}
              </div>
            )}
          />

          {/* Location Fields */}
          <div className="grid grid-cols-2 gap-4">
            <form.Field
              name="latitude"
              children={(field: any) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Latitude</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    step="any"
                    placeholder="e.g. 23.8103"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(parseFloat(e.target.value) || 0)
                    }
                    disabled={registerMutation.isPending}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-500">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  )}
                </div>
              )}
            />

            <form.Field
              name="longitude"
              children={(field: any) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Longitude</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    step="any"
                    placeholder="e.g. 90.4125"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(parseFloat(e.target.value) || 0)
                    }
                    disabled={registerMutation.isPending}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-500">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {/* Optional Organization Fields */}
          {role === "ORGANIZATION" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <form.Field
                  name="establishedYear"
                  children={(field: any) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>
                        Established Year (Optional)
                      </Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        placeholder="e.g. 2010"
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
                      <Label htmlFor={field.name}>
                        Reg. Number (Optional)
                      </Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        placeholder="Registration number"
                        value={field.state.value || ""}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        disabled={registerMutation.isPending}
                      />
                    </div>
                  )}
                />
              </div>
            </>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-muted-foreground text-center">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
