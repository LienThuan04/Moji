import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { IUser } from "@/types/backend";
import { useAppSelector } from "@/redux/hooks";
import { LogOutAccount } from "@/components/auth/logoutAccount";

export const HomePage: React.FC = () => {
    const User = useAppSelector((state: { account: { user: IUser } }) => state.account.user);
    const IsAuthenticated = useAppSelector((state: { account: { isAuthenticated: boolean } }) => state.account.isAuthenticated);
    const IsLoading = useAppSelector((state: { account: { isLoading: boolean } }) => state.account.isLoading);

    const features = [
        {
            title: "Instant Messaging",
            desc: "Send messages instantly with multi-device sync and ultra-low latency.",
        },
        {
            title: "Security",
            desc: "End-to-end encryption and secure authentication with refresh tokens.",
        },
        {
            title: "Team Collaboration",
            desc: "Create chat rooms, share files, and pin important messages for your team.",
        },
    ];

    return (
        <div className="relative min-h-screen bg-gradient-to-b from-background via-background to-foreground/5 text-foreground">
            <div
                className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,_rgba(126,186,255,0.18),transparent_55%)]"
                aria-hidden
            />

            <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6 lg:px-8">
                <Link to="/" className="text-lg font-semibold tracking-tight" onClick={() => {
                    window.location.href = '/';
                }}>
                    Moji Chat
                </Link>
                <div className="flex items-center gap-3">
                    {IsAuthenticated && User && User.email ? (
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col items-end">
                                <p className="text-sm font-medium">{User.displayName || "User"}</p>
                                <p className="text-xs text-muted-foreground">{User.email}</p>
                            </div>
                            <div className="size-9 rounded-full bg-gradient-to-br from-primary to-primary/60 text-primary-foreground flex items-center justify-center font-semibold text-sm">
                                {User.displayName ? User.displayName.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div className="flex items-center gap-2">
                                {/* <Button size="sm" asChild>
                                    <Link to="/chat">Open Chat</Link>
                                </Button> */}
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={LogOutAccount}
                                    disabled={IsLoading}
                                >
                                    {IsLoading ? (
                                        <span className="inline-flex items-center">
                                            <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                            Logging out...
                                        </span>
                                    ) : (
                                        'Logout'
                                    )}
                                </Button>
                            </div>
                        </div>
                    ) : null}
                </div>
            </header>

            {/* Full-page subtle loading overlay when IsLoading is true */}
            {IsLoading && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/20">
                    <div className="inline-flex items-center gap-3 rounded-md bg-card/90 px-4 py-3 shadow-lg">
                        <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        <span>Processing...</span>
                    </div>
                </div>
            )}

            <main className="mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-20 pt-6 lg:px-8">
                <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                    <div className="space-y-6">
                        <p className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground shadow-sm">
                            Modern chat platform for teams
                        </p>
                        <div className="space-y-4">
                            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
                                Connect your team, share ideas, work faster.
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                Moji helps you stay focused on conversations, keeps your chat history safe, and enables real-time collaboration.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            {!IsAuthenticated && <>
                                <Button size="lg" asChild>
                                    <Link to="/signup">Create Account</Link>
                                </Button>
                                <Button size="lg" variant="outline" asChild>
                                    <Link to="/signin">Sign In</Link>
                                </Button>
                                <span className="text-sm text-muted-foreground">No credit card needed, try now.</span>
                            </>}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2 rounded-full bg-card/70 px-3 py-1 shadow-sm">
                                <span className="size-2 rounded-full bg-green-400" aria-hidden />
                                <span>Online 24/7</span>
                            </div>
                            <Separator className="hidden h-4 lg:block" orientation="vertical" />
                            <span>100K+ messages sent daily</span>

                        </div>
                        {IsAuthenticated &&
                            <Button size="lg" asChild className="bg-gray-800 text-white hover:text-black/90 focus-visible:ring-gray-800" variant={'outline'}>
                                <Link to="/chat">Open Chat</Link>
                            </Button>
                        }

                    </div>
                    <div className="relative">
                        <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-primary/10 blur-3xl" aria-hidden />
                        <Card className="border-input/60 bg-card/70 backdrop-blur">
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>Real-time updates</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {["Alice shared design files", "Bob mentioned you in #design", "Dev team created new sprint"].map((text) => (
                                    <div
                                        key={text}
                                        className="flex items-start gap-3 rounded-lg border border-border/60 bg-background/60 px-4 py-3"
                                    >
                                        <div className="mt-1 size-2 rounded-full bg-primary" aria-hidden />
                                        <div>
                                            <p className="text-sm font-medium">{text}</p>
                                            <p className="text-xs text-muted-foreground">Just now · Activity feed</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <section className="space-y-8">
                    <div className="flex flex-col gap-2">
                        <p className="text-sm font-semibold text-primary">Main features</p>
                        <h2 className="text-2xl font-semibold">Built for growing teams</h2>
                        <p className="text-muted-foreground max-w-2xl">
                            Moji combines instant messaging, task management, and file sharing to help your team move faster.
                        </p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-3">
                        {features.map((item) => (
                            <Card key={item.title} className="h-full border-input/60 bg-card/80 backdrop-blur">
                                <CardHeader>
                                    <CardTitle>{item.title}</CardTitle>
                                    <CardDescription>{item.desc}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2 text-sm font-medium text-primary">
                                        <span aria-hidden>→</span>
                                        Try it in 1 minute
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {!IsAuthenticated &&
                    <>
                        <section className="rounded-2xl border border-input/60 bg-card/70 px-8 py-10 shadow-sm backdrop-blur">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div className="space-y-2">
                                    <p className="text-sm font-semibold text-primary">Ready to chat</p>
                                    <h3 className="text-2xl font-semibold">Start free, upgrade when you need.</h3>
                                    <p className="text-muted-foreground">
                                        Create an account now and invite your team to your first chat room.
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <Button size="lg" asChild>
                                        <Link to="/signup">Create Account</Link>
                                    </Button>
                                    <Button size="lg" variant="outline" asChild>
                                        <Link to="/signin">Already have account</Link>
                                    </Button>
                                </div>
                            </div>
                        </section>
                    </>
                }
            </main>
        </div>
    );
};