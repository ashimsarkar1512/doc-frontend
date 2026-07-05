import type { Metadata } from "next";
import { Geist, Geist_Mono, Quicksand } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "sonner";
import { ReduxProvider } from "@/providers/redux.provider";
import { SocketProvider } from "@/providers/SocketProvider";
import { E2EEProvider } from "@/providers/E2EEProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "WeightLossMD & Wellness",
  description: "Medical Weight Management Program",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${quicksand.variable} h-full antialiased`}
    >
      <body className=" font-sans min-h-full flex flex-col" suppressHydrationWarning>
        <ReduxProvider>
          <SocketProvider>
            <E2EEProvider>
              <Toaster richColors position="top-right" />
              <div className="flex-1">{children}</div>
            </E2EEProvider>
          </SocketProvider>
        </ReduxProvider>

        {/* Live chat widget start */}
        <Script id="livechat-widget" strategy="lazyOnload">
          {`
            window.__lc = window.__lc || {};
            window.__lc.license = 19737988;
            window.__lc.integration_name = "manual_channels";
            window.__lc.product_name = "livechat";
            ;(function(n,t,c){function i(n){return e._h?e._h.apply(null,n):e._q.push(n)}var e={_q:[],_h:null,_v:"2.0",on:function(){i(["on",c.call(arguments)])},once:function(){i(["once",c.call(arguments)])},off:function(){i(["off",c.call(arguments)])},get:function(){if(!e._h)throw new Error("[LiveChatWidget] You can't use getters before load.");return i(["get",c.call(arguments)])},call:function(){i(["call",c.call(arguments)])},init:function(){var n=t.createElement("script");n.async=!0,n.type="text/javascript",n.src="https://cdn.livechatinc.com/tracking.js",t.head.appendChild(n)}};!n.__lc.asyncInit&&e.init(),n.LiveChatWidget=n.LiveChatWidget||e}(window,document,[].slice))
          `}
        </Script>
        <noscript>
          <a href="https://www.livechat.com/chat-with/19737988/" rel="nofollow">
            Chat with us
          </a>
          {", powered by "}
          <a
            href="https://www.livechat.com/?welcome"
            rel="noopener nofollow"
            target="_blank"
          >
            LiveChat
          </a>
        </noscript>
        {/* Clover Payment SDK — v1/api.js exposes window.Clover */}
        <Script
          src={
            process.env.NEXT_PUBLIC_CLOVER_ENV === "production"
              ? "https://checkout.clover.com/v1/api.js"
              : "https://checkout.sandbox.dev.clover.com/v1/api.js"
          }
          strategy="afterInteractive"
          id="clover-sdk"
        />
        {/* Live chat widget end */}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
