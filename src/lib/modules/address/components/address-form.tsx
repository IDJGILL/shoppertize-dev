"use client"

import FixedBar from "~/app/_components/fixed-bar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/app/_components/ui/form"
import { Input, PhoneInput } from "~/app/_components/ui/input"
import { useAddressContext } from "./address-context"
import { Button } from "~/app/_components/ui/button"
import OtpInput from "react-otp-input"
import CountDown from "~/lib/ui/_shared/countdown"
import { ModelXDrawer } from "~/app/_components/ui/dialog"
import { Switch } from "~/app/_components/ui/switch"
import LoaderFallBack from "~/app/_components/loader-fallback"
import Box from "~/app/_components/box"
import { nanoid } from "nanoid"

interface AddressFormProps extends React.HTMLAttributes<HTMLElement> {}

export default function AddressForm({ ...props }: AddressFormProps) {
  const {} = props

  const {
    addressForm,
    addressFormHandler,
    sameAddressHandler,
    checkPincodeHandler,
    modelProps,
    resendOtpHandler,
    isAddressLoading,
    isAddressUpdating,
    isOtpResending,
  } = useAddressContext()

  if (isAddressLoading) return <LoaderFallBack className="w-full" />

  return (
    <div className="container px-0 py-5 md:py-10">
      <Box className="mx-auto rounded-none sm:rounded-2xl md:w-max">
        <Form {...addressForm}>
          <form id="address-form" onSubmit={addressFormHandler}>
            <FormField
              control={addressForm.control}
              name="address_id"
              defaultValue={nanoid()}
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input
                      placeholder=" "
                      {...field}
                      type="hidden"
                      className="hidden"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={addressForm.control}
              name="shipping_otp"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input
                      placeholder=" "
                      {...field}
                      type="hidden"
                      className="hidden"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={addressForm.control}
              name="shipping_token"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input
                      placeholder=" "
                      {...field}
                      type="hidden"
                      className="hidden"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <section className="flex w-full flex-col items-center gap-8 transition-all duration-300 ease-in-out md:flex-row">
              <section className="flex flex-1 flex-col gap-5 pb-4">
                <div className="h-9">
                  <h3 className="font-semibold">Shipping Details</h3>
                </div>

                <div className="flex w-full gap-2">
                  <FormField
                    control={addressForm.control}
                    name="shipping_firstName"
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
                    name="shipping_lastName"
                    render={({ field }) => (
                      <div className="flex-1">
                        <FormItem>
                          <FormControl>
                            <Input placeholder=" " {...field} />
                          </FormControl>
                          <FormLabel>Last name</FormLabel>
                        </FormItem>

                        <FormMessage />
                      </div>
                    )}
                  />
                </div>

                <div>
                  <FormField
                    control={addressForm.control}
                    name="shipping_phone"
                    render={({ field }) => (
                      <div>
                        <FormItem>
                          <PhoneInput
                            field={{ ...field }}
                            form={addressForm}
                            name="shipping_phone"
                          />
                        </FormItem>

                        <FormMessage />
                      </div>
                    )}
                  />
                </div>

                <FormField
                  control={addressForm.control}
                  name="shipping_address1"
                  render={({ field }) => (
                    <div>
                      <FormItem>
                        <FormControl>
                          <Input placeholder=" " {...field} />
                        </FormControl>
                        <FormLabel>
                          Flat, House no., Building, Company, Apartment
                        </FormLabel>
                      </FormItem>

                      <FormMessage />
                    </div>
                  )}
                />

                <FormField
                  control={addressForm.control}
                  name="shipping_address2"
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
                  name="shipping_postcode"
                  render={({ field }) => (
                    <div>
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder=" "
                            type="text"
                            {...field}
                            onKeyUp={() => checkPincodeHandler("shipping")}
                          ></Input>
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
                    name="shipping_city"
                    render={({ field }) => (
                      <div>
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

                  <FormField
                    control={addressForm.control}
                    name="shipping_state"
                    render={({ field }) => (
                      <div>
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              placeholder=" "
                              {...field}
                              disabled
                              className="select-none disabled:!border disabled:!border-gray-300"
                            />
                          </FormControl>

                          <FormLabel>State</FormLabel>
                        </FormItem>

                        <FormMessage />
                      </div>
                    )}
                  />

                  <FormField
                    control={addressForm.control}
                    name="shipping_country"
                    defaultValue="IN"
                    render={({ field }) => (
                      <div>
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder=" " {...field} type="hidden" />
                          </FormControl>
                        </FormItem>
                      </div>
                    )}
                  />

                  <FormField
                    control={addressForm.control}
                    name="addressType"
                    defaultValue="home"
                    render={({ field }) => (
                      <div>
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder=" " {...field} type="hidden" />
                          </FormControl>
                        </FormItem>
                      </div>
                    )}
                  />
                </div>

                {/* Billing Toggle */}

                <FormField
                  control={addressForm.control}
                  name="isTaxInvoice"
                  defaultValue={false}
                  render={({ field }) => (
                    <FormItem className="flex h-12 flex-row items-center justify-between space-x-3 space-y-0">
                      <label className="">
                        <h3 className="text-sm font-medium">
                          Need GST Invoice? {`(Optional)`}
                        </h3>

                        <p className="text-sm text-muted-foreground">
                          You will get gst invoice within 24 hours by Email.
                        </p>
                      </label>

                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </section>

              {addressForm.watch("isTaxInvoice") && (
                <div className="hidden h-20 border-2 border-r md:block"></div>
              )}

              {/* GST Billing Address */}
              {addressForm.watch("isTaxInvoice") && (
                <section className="flex flex-1 flex-col gap-5 pb-4">
                  <div className="flex h-9 items-center justify-between">
                    <h3 className="font-semibold">Billing Details</h3>

                    <Button
                      type="button"
                      variant="outline"
                      className="h-8 px-3 text-xs hover:bg-slate-100"
                      onClick={() => sameAddressHandler()}
                    >
                      Same as Shipping
                    </Button>
                  </div>

                  <FormField
                    control={addressForm.control}
                    name="billing_firstName"
                    render={({ field }) => (
                      <div className="flex-1">
                        <FormItem>
                          <FormControl>
                            <Input placeholder=" " {...field} />
                          </FormControl>

                          <FormLabel>Company Name</FormLabel>
                        </FormItem>

                        <FormMessage />
                      </div>
                    )}
                  />

                  <FormField
                    control={addressForm.control}
                    name="billing_tax"
                    render={({ field }) => (
                      <div className="flex-1">
                        <FormItem>
                          <FormControl>
                            <Input placeholder=" " {...field} maxLength={15} />
                          </FormControl>

                          <FormLabel>GST Number</FormLabel>
                        </FormItem>

                        <FormMessage />
                      </div>
                    )}
                  />

                  <FormField
                    control={addressForm.control}
                    name="billing_phone"
                    render={({ field }) => (
                      <div>
                        <FormItem>
                          <PhoneInput
                            field={{ ...field }}
                            form={addressForm}
                            name="billing_phone"
                          />
                        </FormItem>

                        <FormMessage />
                      </div>
                    )}
                  />

                  <FormField
                    control={addressForm.control}
                    name="billing_address1"
                    render={({ field }) => (
                      <div>
                        <FormItem>
                          <FormControl>
                            <Input placeholder=" " {...field} />
                          </FormControl>
                          <FormLabel>
                            Flat, House no., Building, Company, Apartment
                          </FormLabel>
                        </FormItem>

                        <FormMessage />
                      </div>
                    )}
                  />

                  <FormField
                    control={addressForm.control}
                    name="billing_address2"
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
                    name="billing_postcode"
                    render={({ field }) => (
                      <div>
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder=" "
                              type="text"
                              {...field}
                              onKeyUp={() => checkPincodeHandler("billing")}
                            ></Input>
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
                      name="billing_city"
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

                    <FormField
                      control={addressForm.control}
                      name="billing_state"
                      render={({ field }) => (
                        <div className="flex-1">
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                placeholder=" "
                                {...field}
                                disabled
                                className="select-none disabled:!border disabled:!border-gray-300"
                              />
                            </FormControl>

                            <FormLabel>State</FormLabel>
                          </FormItem>

                          <FormMessage />
                        </div>
                      )}
                    />

                    <FormField
                      control={addressForm.control}
                      name="billing_country"
                      defaultValue="IN"
                      render={({ field }) => (
                        <div>
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder=" " {...field} type="hidden" />
                            </FormControl>
                          </FormItem>
                        </div>
                      )}
                    />
                  </div>
                </section>
              )}
            </section>

            <FixedBar className="p-4 shadow-none md:relative md:p-0">
              <Button
                type="submit"
                className="w-full"
                loading={isAddressUpdating ? "true" : "false"}
              >
                Update
              </Button>
            </FixedBar>
          </form>
        </Form>

        <ModelXDrawer {...modelProps}>
          <div className="mb-6">
            <h3 className="text-2xl font-semibold">Verify</h3>
            <p className="text-sm">
              You will receive a 4 digit otp from{" "}
              <span className="font-semibold">OTPLESS</span>
            </p>
          </div>

          <div className="">
            <OtpInput
              value={addressForm.watch("shipping_otp")}
              onChange={(value) => addressForm.setValue("shipping_otp", value)}
              numInputs={4}
              renderInput={(props) => (
                <input
                  {...props}
                  className="h-12 w-full flex-1 rounded-md border focus-visible:outline-none"
                  inputMode="numeric"
                />
              )}
              containerStyle={{
                gap: "1rem",
              }}
            />

            <div className="py-4 text-center text-sm text-red-500">
              {addressForm.formState.errors?.shipping_otp?.message}
            </div>

            <Button
              form="address-form"
              type="submit"
              className="w-full"
              loading={isAddressUpdating ? "true" : "false"}
            >
              Verify & Save
            </Button>

            <CountDown
              duration={60}
              renderer={({ count, api }) => (
                <Button
                  variant="outline"
                  type="button"
                  disabled={!api.isCompleted}
                  loading={isOtpResending ? "true" : "false"}
                  className="mt-2 w-full"
                  onClick={() => {
                    if (!api.isCompleted) return

                    resendOtpHandler(() => api.reset())
                  }}
                >
                  {api.isCompleted
                    ? "Didn't receive the code? Resend"
                    : `Resend again in 00:${count}`}
                </Button>
              )}
            />
          </div>
        </ModelXDrawer>
      </Box>
    </div>
  )
}
