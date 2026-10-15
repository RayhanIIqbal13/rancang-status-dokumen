import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Shield, User, Users } from 'lucide-react';
import React, { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface LoginForm {
    [key: string]: any;
    email: string;
    password: string;
    remember: boolean;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const fillDemo = (email: string) => {
        setData({
            email,
            password: 'password',
            remember: true,
        });
    };

    return (
        <AuthLayout
            title="Masuk ke Akun SAK ITK"
            description="Masukkan email dan kata sandi untuk mengakses layanan status dokumen"
        >
            <Head title="Masuk - Studio Admin SAK ITK" />

            <form className="flex flex-col gap-4" onSubmit={submit}>
                <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-medium">
                        Alamat Email Kampus
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        required
                        autoFocus
                        tabIndex={1}
                        autoComplete="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="nama@univ.ac.id"
                        className="h-8 text-xs"
                    />
                    <InputError message={errors.email} />
                </div>

                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-xs font-medium">
                            Kata Sandi
                        </Label>
                        {canResetPassword && (
                            <TextLink
                                href={route('password.request')}
                                className="text-[11px] text-muted-foreground hover:text-foreground"
                                tabIndex={5}
                            >
                                Lupa sandi?
                            </TextLink>
                        )}
                    </div>
                    <Input
                        id="password"
                        type="password"
                        required
                        tabIndex={2}
                        autoComplete="current-password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="••••••••"
                        className="h-8 text-xs"
                    />
                    <InputError message={errors.password} />
                </div>

                <div className="flex items-center space-x-2 pt-1">
                    <Checkbox
                        id="remember"
                        name="remember"
                        tabIndex={3}
                        checked={data.remember}
                        onCheckedChange={(checked) => setData('remember', Boolean(checked))}
                    />
                    <Label htmlFor="remember" className="text-xs text-muted-foreground font-normal cursor-pointer">
                        Ingat saya di perangkat ini
                    </Label>
                </div>

                <Button
                    type="submit"
                    className="mt-2 h-8 w-full gap-2 text-xs shadow-xs"
                    tabIndex={4}
                    disabled={processing}
                >
                    {processing && <LoaderCircle className="size-3.5 animate-spin" />}
                    <span>Masuk ke Sistem</span>
                </Button>

                {/* Quick Demo Accounts */}
                <div className="mt-2 border-t pt-3 space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-center">
                        Akun Demo Cepat
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                        <button
                            type="button"
                            onClick={() => fillDemo('pengusul@univ.ac.id')}
                            className="rounded-md border bg-muted/40 p-1.5 text-left text-[11px] transition-colors hover:bg-muted hover:border-primary/50"
                        >
                            <span className="font-semibold block text-foreground">Pengusul</span>
                            <span className="text-[10px] text-muted-foreground">Dr. Ahmad Hidayat</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => fillDemo('stafkeuangan@univ.ac.id')}
                            className="rounded-md border bg-muted/40 p-1.5 text-left text-[11px] transition-colors hover:bg-muted hover:border-primary/50"
                        >
                            <span className="font-semibold block text-foreground">Staf Keuangan</span>
                            <span className="text-[10px] text-muted-foreground">Siti Rahmawati</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => fillDemo('pimpinan@univ.ac.id')}
                            className="rounded-md border bg-muted/40 p-1.5 text-left text-[11px] transition-colors hover:bg-muted hover:border-primary/50"
                        >
                            <span className="font-semibold block text-foreground">Pimpinan</span>
                            <span className="text-[10px] text-muted-foreground">Prof. Bambang</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => fillDemo('admin@univ.ac.id')}
                            className="rounded-md border bg-muted/40 p-1.5 text-left text-[11px] transition-colors hover:bg-muted hover:border-primary/50"
                        >
                            <span className="font-semibold block text-foreground">Admin Pusat</span>
                            <span className="text-[10px] text-muted-foreground">Superuser</span>
                        </button>
                    </div>
                </div>
            </form>

            {status && <div className="mt-3 text-center text-xs font-medium text-emerald-600">{status}</div>}
        </AuthLayout>
    );
}
