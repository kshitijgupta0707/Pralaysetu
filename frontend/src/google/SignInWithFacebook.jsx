//step 1: Create an instance of the Facebook provider object 
import { FacebookAuthProvider, signInWithPopup } from "firebase/auth";
// import { auth } from "@/firebase";
import { useAuthStore } from "@/store/useAuthstore";
import toast from "react-hot-toast";
import { auth } from "@/firebase"

export const SignInWithFacebook = () => {
  const { loginwithOAuth } = useAuthStore(); // Reuse same function assuming it handles OAuth users

  async function facebookLogin() {
    const provider = new FacebookAuthProvider();
    // auth.languageCode = 'it';
    // To apply the default browser preference instead of explicitly setting it.
    auth.useDeviceLanguage();

    try {
      const result = await signInWithPopup(auth, provider);

      const user = result.user;
      console.log("User = ", user)

      // if (user) {
      await loginwithOAuth({ email: user.email }); // sending to backend
      // toast.success("Signed in successfully!");
      // }
    } catch (error) {
      toast.error("Facebook sign in failed. Please try again.");
      console.error("Facebook sign in error:", error);
    }
  }

  return (
    <div className="mb-2 flex flex-col items-center text-[15px] hover:bg-transparent">
      <button
        onClick={facebookLogin}
        className="flex items-center justify-center gap-3 w-full max-w-xs py-3 px-4 bg-white text-gray-700 rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
                <img className="w-6" src="./facebook.png" alt="facebol" />

        <span className="font-medium">Facebook</span>
      </button>
    </div>
  );
};
