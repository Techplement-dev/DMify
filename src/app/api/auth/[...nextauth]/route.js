// import NextAuth from "next-auth"
// import FacebookProvider from "next-auth/providers/facebook"

// export default NextAuth({
//   providers: [
//     FacebookProvider({
//       clientId: process.env.FB_APP_ID,
//       clientSecret: process.env.FB_APP_SECRET,
//       authorization: {
//         url: "https://www.facebook.com/v19.0/dialog/oauth",
//         params: {
//           client_id: process.env.FB_APP_ID,
//           redirect_uri: process.env.FB_REDIRECT_URI,
//           scope: "pages_show_list,pages_read_engagement,instagram_basic,instagram_manage_messages,instagram_manage_comments,pages_messaging",
//         },
//       },
//     }),
//   ],
//   secret: process.env.NEXTAUTH_SECRET,
// })
import NextAuth from "next-auth"
import FacebookProvider from "next-auth/providers/facebook"

const authOptions = {
  providers: [
    FacebookProvider({
      clientId: process.env.FB_APP_ID,
      clientSecret: process.env.FB_APP_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
