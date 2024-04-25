"use client"

import FixedBar from "~/app/_components/fixed-bar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/app/_components/ui/form"
import { Input, PhoneInput } from "~/app/_components/ui/input"
import { Button } from "~/app/_components/ui/button"
import { ModelXDrawer } from "~/app/_components/ui/dialog"
import LoaderFallBack from "~/app/_components/loader-fallback"
import Box from "~/app/_components/box"
import { useAddress } from "~/vertex/components/address/address-context"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "~/app/_components/ui/input-otp"
import { AddressOtp } from "~/vertex/components/address/address-otp"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/app/_components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "~/app/_components/ui/toggle-group"
import { nanoid } from "nanoid"

interface AddressFormProps extends React.HTMLAttributes<HTMLElement> {}

export default function AddressForm({ ...props }: AddressFormProps) {
  const {} = props

  const {
    addressForm,
    addressFormHandler,
    isAddressLoading,
    isAddressUpdating,
    statesByCountryCode,
    country,
    checkPostcodeHandler,
  } = useAddress()

  if (isAddressLoading) return <LoaderFallBack className="w-full" />

  return (
    <div className="container px-0 py-5 md:py-10">
      <Box className="mx-auto max-w-xl rounded-none sm:rounded-3xl">
        {/* Address Form */}
        <Form {...addressForm}>
          <form onSubmit={addressFormHandler} className="space-y-4">
            <FormField
              control={addressForm.control}
              name="id"
              defaultValue={nanoid()}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder=" " {...field} type="hidden" />
                  </FormControl>
                </FormItem>
              )}
            />

            <h3 className="font-semibold">Shipping Details</h3>

            <FormField
              control={addressForm.control}
              name="fullName"
              render={({ field }) => (
                <div className="flex-1">
                  <FormItem>
                    <FormControl>
                      <Input placeholder=" " {...field} />
                    </FormControl>

                    <FormLabel>First name</FormLabel>
                  </FormItem>

                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={addressForm.control}
              name="phone"
              render={({ field }) => (
                <div>
                  <FormItem>
                    <PhoneInput field={{ ...field }} form={addressForm} name="phone" />
                  </FormItem>

                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={addressForm.control}
              name="address"
              render={({ field }) => (
                <div>
                  <FormItem>
                    <FormControl>
                      <Input placeholder=" " {...field} />
                    </FormControl>
                    <FormLabel>Flat, House no., Building, Company, Apartment</FormLabel>
                  </FormItem>

                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={addressForm.control}
              name="locality"
              render={({ field }) => (
                <div>
                  <FormItem>
                    <FormControl>
                      <Input placeholder=" " {...field} />
                    </FormControl>
                    <FormLabel>Area, Street, Sector, Village</FormLabel>
                  </FormItem>

                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={addressForm.control}
              name="postcode"
              render={({ field }) => (
                <div>
                  <FormItem>
                    <FormControl>
                      <Input placeholder=" " type="text" {...field} onKeyUp={() => checkPostcodeHandler()}></Input>
                    </FormControl>

                    <FormLabel>Post code</FormLabel>
                  </FormItem>

                  <FormMessage />
                </div>
              )}
            />

            <div className="flex gap-2">
              <FormField
                control={addressForm.control}
                name="city"
                render={({ field }) => (
                  <div className="flex-1">
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder=" " {...field} />
                      </FormControl>

                      <FormLabel>City</FormLabel>
                    </FormItem>

                    <FormMessage />
                  </div>
                )}
              />

              {statesByCountryCode !== null ? (
                <FormField
                  control={addressForm.control}
                  name="state"
                  render={({ field }) => (
                    <div className="flex-1">
                      <FormItem className="flex-1">
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a verified email to display" />
                              </SelectTrigger>
                            </FormControl>

                            <SelectContent>
                              {statesByCountryCode.map((a) => (
                                <SelectItem key={a.code} value={a.code}>
                                  {a.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>

                        <FormLabel>State</FormLabel>
                      </FormItem>

                      <FormMessage />
                    </div>
                  )}
                />
              ) : (
                <FormField
                  control={addressForm.control}
                  name="state"
                  render={({ field }) => (
                    <div className="flex-1">
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder=" " {...field} />
                        </FormControl>

                        <FormLabel>State</FormLabel>
                      </FormItem>

                      <FormMessage />
                    </div>
                  )}
                />
              )}
            </div>

            <FormField
              control={addressForm.control}
              name="country"
              render={({ field }) => (
                <div>
                  <FormItem className="flex-1">
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Country" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {country.map((a) => (
                            <SelectItem key={a.code} value={a.code}>
                              {a.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>

                    <FormLabel>Country</FormLabel>
                  </FormItem>

                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={addressForm.control}
              name="saveAs"
              render={({ field }) => (
                <FormItem className="w-max">
                  <FormControl>
                    <ToggleGroup {...field} type="single">
                      <ToggleGroupItem value="home">Home</ToggleGroupItem>
                      <ToggleGroupItem value="office">Office</ToggleGroupItem>
                      <ToggleGroupItem value="other">Other</ToggleGroupItem>
                    </ToggleGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <FixedBar className="p-4 shadow-none md:relative md:p-0">
              <Button type="submit" className="w-full" loading={isAddressUpdating ? "true" : "false"}>
                Update
              </Button>
            </FixedBar>
          </form>
        </Form>
      </Box>

      <AddressOtp>
        {({ form, mutateVerify, isResending, isVerifying, mutateResend, modelProps, countdown }) => (
          <ModelXDrawer {...modelProps}>
            <div className="mb-6">
              <h3 className="text-2xl font-semibold">Verify</h3>
              <p className="text-sm">
                You will receive a 4 digit otp from <span className="font-semibold">OTPLESS</span>
              </p>
            </div>

            <div className="">
              <Form {...form}>
                <form onSubmit={mutateVerify}>
                  <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                      <FormItem className="hidden">
                        <FormControl>
                          <Input placeholder=" " {...field} type="hidden" className="hidden" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem className="mx-auto mb-6">
                        <FormControl>
                          <InputOTP maxLength={4} {...field}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                            </InputOTPGroup>

                            <InputOTPSeparator />

                            <InputOTPGroup>
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" loading={isVerifying ? "true" : "false"}>
                    Verify & Save
                  </Button>

                  <Button
                    variant="outline"
                    type="button"
                    loading={isResending ? "true" : "false"}
                    className="mt-2 w-full"
                    onClick={() => mutateResend()}
                  >
                    {countdown.isCompleted
                      ? "Didn't receive the code? Resend"
                      : `Resend again in 00:${countdown.remaining}`}
                  </Button>
                </form>
              </Form>
            </div>
          </ModelXDrawer>
        )}
      </AddressOtp>
    </div>
  )
}
