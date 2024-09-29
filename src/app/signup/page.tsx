'use client'

import { useState, useCallback, ChangeEvent, FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import axios, { AxiosError, AxiosResponse } from "axios"
// import { signIn } from "next-auth/react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Import Icons component
import { Icons } from "@/components/ui/icons"

// Setup axios for error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject(new Error("Network error: Please check your connection."))
    }
    return Promise.reject(error)
  }
)

export default function SignUpForm() {
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthday: "",
    gender: "",
    location: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  // const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isPrivacyModalVisible, setIsPrivacyModalVisible] = useState(false)
  const [isPrivacyChecked, setIsPrivacyChecked] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    location: ""
  })
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const router = useRouter()

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))
    },
    []
  )

  const handleSelectChange = useCallback(
    (name: string, value: string) => {
      setFormData((prev) => ({ ...prev, [name]: value }))
    },
    []
  )

  const handleCheckboxChange = useCallback((checked: boolean) => {
    setIsPrivacyChecked(checked)
  }, [])

  // Form validation
  const validateForm = useCallback(() => {
    let valid = true
    const newFieldErrors = { email: "", password: "", confirmPassword: "", gender: "", location: "" }

    // Email validation
    const emailRegex = /\S+@\S+\.\S+/
    if (!emailRegex.test(formData.email)) {
      newFieldErrors.email = "Invalid email address"
      valid = false
    }

    // Password validation
    if (formData.password.length < 8) {
      newFieldErrors.password = "Password must be at least 8 characters"
      valid = false
    }

    if (formData.password !== formData.confirmPassword) {
      newFieldErrors.confirmPassword = "Passwords do not match"
      valid = false
    }

    // Gender validation
    if (!formData.gender) {
      newFieldErrors.gender = "Please select a gender"
      valid = false
    }

    // Location validation
    if (!formData.location) {
      newFieldErrors.location = "Please select a location"
      valid = false
    }

    setFieldErrors(newFieldErrors)
    return valid
  }, [formData])

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!isPrivacyChecked) {
      setIsPrivacyModalVisible(true)
      return
    }

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      const response: AxiosResponse<{ message: string }> = await axios.post("/api/auth/signup", formData)
      setSuccessMessage(response.data.message)
      setIsVerifying(true)
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>
      setErrorMessage(axiosError.response?.data?.message || "Something went wrong.")
    } finally {
      setIsLoading(false)
    }
  }, [formData, isPrivacyChecked, validateForm])

  const handleVerification = useCallback(async () => {
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const response: AxiosResponse<{ message: string }> = await axios.post("/api/auth/verify-email", {
        otp: verificationCode,
      })
      setSuccessMessage(response.data.message)
      setTimeout(() => {
        setSuccessMessage("Verification Successful! Redirecting to Sign-In page...")
        router.push("/signin")
      }, 2000)
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>
      setErrorMessage(axiosError.response?.data?.message || "Invalid verification code.")
    }
  }, [verificationCode, router])

  // const handleGoogleSignIn = useCallback(async () => {
  //   setIsGoogleLoading(true)
  //   try {
  //     await signIn("google")
  //     setSuccessMessage("Google Sign-In Successful!")
  //   } catch {
  //     setErrorMessage("Google sign-in failed. Please try again.")
  //   } finally {
  //     setIsGoogleLoading(false)
  //   }
  // }, [])

  const handlePrivacyAgree = useCallback(() => {
    setIsPrivacyChecked(true)
    setIsPrivacyModalVisible(false)
    handleSubmit(new Event("submit") as unknown as FormEvent)
  }, [handleSubmit])

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-amber-100 to-amber-200">
      <div className="md:w-1/2 flex flex-col justify-center items-center p-8 bg-amber-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold mb-4 text-amber-800">
            EXPLORE WITH US
            <br />
            CAVITEVENTURE
            <span className="relative">
              <span className="text-amber-600"> UNIQUE</span>
              <span className="absolute bottom-0 left-0 w-full h-1 bg-amber-600"></span>
            </span>{" "}
            EXPLORATION.
          </h1>
          <p className="text-amber-700 mb-4">
            Already have an account?{" "}
            <Link href="/signin" className="text-amber-800 underline hover:text-amber-900">
              Sign In
            </Link>
          </p>
          <p className="text-amber-700">
            Explore over 4 places with high-resolution images, shared by a vibrant community.
          </p>
        </motion.div>
      </div>

      <div className="md:w-1/2 flex justify-center items-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="bg-white shadow-md p-6">
            <CardHeader>
              <CardTitle>Sign Up for an account</CardTitle>
              <CardDescription>Enter your details to create your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthday">Birthday</Label>
                  <Input
                    id="birthday"
                    name="birthday"
                    type="date"
                    value={formData.birthday}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select onValueChange={(value) => handleSelectChange("gender", value)}>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldErrors.gender && <p className="text-sm text-red-500">{fieldErrors.gender}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select onValueChange={(value) => handleSelectChange("location", value)}>
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Binakayan">Binakayan</SelectItem>
                      <SelectItem value="Bacoor">Bacoor</SelectItem>
                      <SelectItem value="Rosario">Rosario</SelectItem>
                      <SelectItem value="CaviteCity">Cavite City</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldErrors.location && <p className="text-sm text-red-500">{fieldErrors.location}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  {fieldErrors.email && <p className="text-sm text-red-500">{fieldErrors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  {fieldErrors.password && <p className="text-sm text-red-500">{fieldErrors.password}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                  {fieldErrors.confirmPassword && <p className="text-sm text-red-500">{fieldErrors.confirmPassword}</p>}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="dataPrivacy"
                    checked={isPrivacyChecked}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label
                    htmlFor="dataPrivacy"
                    className="text-sm cursor-pointer"
                  >
                    I agree to the{" "}
                    <span className="text-amber-600 underline">Data Privacy Policy</span>
                  </Label>
                </div>

                {errorMessage && (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}
                {successMessage && (
                  <Alert>
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{successMessage}</AlertDescription>
                  </Alert>
                )}
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button
                type="submit"
                className="w-full"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Sign Up'
                )}
              </Button>
              {/* <Button
                variant="outline"
                type="button"
                className="w-full"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <Icons.google className="mr-2 h-4 w-4" />
                    Sign Up with Google
                  </>
                )}
              </Button> */}
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      {isVerifying && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <Card className="w-96 bg-white shadow-md p-6">
            <CardHeader>
              <CardTitle>Verify Your Email</CardTitle>
              <CardDescription>Enter the verification code sent to your email</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="verificationCode">Verification Code</Label>
                <Input
                  id="verificationCode"
                  name="verificationCode"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleVerification} className="w-full">Verify</Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}

      {isPrivacyModalVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <Card className="w-96 bg-white shadow-md p-6">
            <CardHeader>
              <CardTitle>Privacy Policy</CardTitle>
              <CardDescription>Please read and agree to our privacy policy</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is where the privacy policy content would go...</p>
            </CardContent>
            <CardFooter>
              <Button onClick={handlePrivacyAgree} className="w-full">I Agree</Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
