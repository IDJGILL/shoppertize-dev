"use client"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/app/_components/ui/form"
import { Input } from "~/app/_components/ui/input"
import { Button } from "~/app/_components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/app/_components/ui/select"
import { ScrollArea } from "~/app/_components/ui/scroll-area"
import useProfile from "~/lib/utils/hooks/useProfile"
import { type ProfileDTOType } from "~/lib/server/api/auth/auth.dtos"
import { countries } from "~/lib/utils/constants/countries"
import Box from "~/app/_components/box"

interface ProfileFormProps extends React.HTMLAttributes<HTMLElement> {
  profile: ProfileDTOType | null
}

export default function ProfileForm({ ...props }: ProfileFormProps) {
  const { form, handleSubmit, isLoading } = useProfile({
    profile: props.profile,
  })

  return (
    <Box className="">
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of birth</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <ScrollArea className="h-72 w-full rounded-md">
                      {countries.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            loading={isLoading ? "true" : "false"}
          >
            Update
          </Button>
        </form>
      </Form>
    </Box>
  )
}
