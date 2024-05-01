"use client"

import FixedBar from "~/app/_components/fixed-bar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/app/_components/ui/form"
import { Input } from "~/app/_components/ui/input"
import { Button } from "~/app/_components/ui/button"
import { ModelXDrawer } from "~/app/_components/ui/dialog"
import Box from "~/app/_components/box"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "~/app/_components/ui/input-otp"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/app/_components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "~/app/_components/ui/toggle-group"
import { nanoid } from "nanoid"
import { Checkbox } from "~/app/_components/ui/checkbox"
import { PhoneInput } from "~/app/_components/phone-input"
import { atom } from "jotai"
import { useAddressForm } from "~/vertex/components/address/address-form-context"

export const addressCountdownAtom = atom(0)

interface AddressFormProps extends React.HTMLAttributes<HTMLElement> {}

export default function AddressForms({ ...props }: AddressFormProps) {
  const {} = props

  const context = useAddressForm()

  return (
    <div className="container px-0 py-5 md:py-10">
      <Box className="mx-auto max-w-xl rounded-none sm:rounded-3xl">
        <div>
          <Form {...context.addressForm}>
            <form onSubmit={context.addressFormHandler} className="space-y-6">
              <h3 className="font-semibold">Shipping Details</h3>

              <FormField
                control={context.addressForm.control}
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

              <FormField
                control={context.addressForm.control}
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
                control={context.addressForm.control}
                name="phone"
                render={({ field }) => (
                  <div>
                    <FormItem>
                      <FormControl>
                        <PhoneInput {...field} />
                      </FormControl>

                      <p className="mt-2 text-xs text-gray-400">
                        Note: The phone number is required for order delivery and notifications.
                      </p>
                    </FormItem>

                    <FormMessage />
                  </div>
                )}
              />

              <FormField
                control={context.addressForm.control}
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
                control={context.addressForm.control}
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
                control={context.addressForm.control}
                name="postcode"
                render={({ field }) => (
                  <div>
                    <FormItem>
                      <FormControl>
                        <Input placeholder=" " {...{ ...field, ...context.postcodeController }}></Input>
                      </FormControl>

                      <FormLabel>Post code</FormLabel>
                    </FormItem>

                    <FormMessage />
                  </div>
                )}
              />

              <div className="flex gap-2">
                <FormField
                  control={context.addressForm.control}
                  name="city"
                  render={({ field }) => (
                    <div className="flex-1">
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder=" " {...{ ...field, ...context.cityController }} />
                        </FormControl>

                        <FormLabel>City</FormLabel>
                      </FormItem>

                      <FormMessage />
                    </div>
                  )}
                />

                <FormField
                  control={context.addressForm.control}
                  name="state"
                  render={({ field }) => (
                    <div className="flex-1">
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder=" " {...{ ...field, ...context.stateController }} />
                        </FormControl>

                        <FormLabel>State</FormLabel>
                      </FormItem>

                      <FormMessage />
                    </div>
                  )}
                />
              </div>

              <FormField
                control={context.addressForm.control}
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
                            {context.country.map((a) => (
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
                control={context.addressForm.control}
                name="saveAs"
                render={({ field }) => (
                  <div>
                    <h3 className="mb-4 text-sm font-medium text-muted-foreground">Save Address As</h3>
                    <FormItem className="w-max">
                      <FormControl>
                        <ToggleGroup type="single" value={field.value} onValueChange={(a) => field.onChange(a)}>
                          <ToggleGroupItem value="home">Home</ToggleGroupItem>
                          <ToggleGroupItem value="office">Office</ToggleGroupItem>
                          <ToggleGroupItem value="other" defaultChecked>
                            Other
                          </ToggleGroupItem>
                        </ToggleGroup>
                      </FormControl>
                    </FormItem>

                    <FormMessage />
                  </div>
                )}
              />

              <FormField
                control={context.addressForm.control}
                name="isDefault"
                render={({ field }) => (
                  <div>
                    <FormItem>
                      <div className="flex items-center space-x-2">
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} id="isDefault" />
                        <label
                          htmlFor="isDefault"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Make this my default address
                        </label>
                      </div>
                    </FormItem>

                    <FormMessage />
                  </div>
                )}
              />

              <FixedBar className="p-4 shadow-none md:relative md:p-0">
                <Button type="submit" className="w-full" isLoading={context.isUpdating}>
                  Update Address
                </Button>
              </FixedBar>
            </form>
          </Form>

          <ModelXDrawer {...context.modelController}>
            <div className="mb-6">
              <h3 className="text-2xl font-semibold">Verify</h3>
              <p className="text-sm">
                You will receive a 4 digit otp from <span className="font-semibold">OTPLESS</span>
              </p>
            </div>

            <div className="">
              <Form {...context.otpForm}>
                <form onSubmit={context.otpFormHandler}>
                  <FormField
                    control={context.otpForm.control}
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
                    control={context.otpForm.control}
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

                  <Button type="submit" className="w-full" isLoading={context.isVerifying}>
                    Verify & Save
                  </Button>

                  <Button
                    variant="outline"
                    type="button"
                    isLoading={context.isResending}
                    disabled={!context.isCountdownComplete}
                    className="mt-2 w-full"
                    onClick={() => context.mutateResend()}
                  >
                    {context.isCountdownComplete
                      ? "Didn't receive the code? Resend"
                      : `Resend again in 00:${context.countdownRemaining}`}
                  </Button>
                </form>
              </Form>
            </div>
          </ModelXDrawer>
        </div>
      </Box>
    </div>
  )
}
