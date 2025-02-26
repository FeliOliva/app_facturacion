"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext"; // Asegúrate de que la ruta sea correcta
import { useRouter } from 'next/navigation';
import { useState } from 'react';


export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const { login } = useAuth();
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const usuario = form.usuario.value;
        const password = form.password.value;

        try {
            await login(usuario, password);

            router.push('/');
            // Redirigir o hacer algo después del login exitoso
        } catch (error) {
            console.error("Error durante el inicio de sesión:", error);
            setErrorMessage(errorMessage || 'Error en el inicio de sesión.');  // Mensaje de error
            // Maneja el error, como mostrar un mensaje de error al usuario
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>} {/* Mensaje de error */}
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="usuario">Nombre de Usuario</Label>
                                <Input
                                    id="usuario"
                                    type="text" // Cambia a "text"
                                    placeholder="Nombre de usuario"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Contraseña</Label>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Olvidaste tu contraseña?
                                    </a>
                                </div>
                                <Input id="password" type="password" placeholder="Ingrese su contraseña" required />
                            </div>
                            <Button type="submit" className="w-full">
                                Login
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            ¿Todavía no estás registrado?{" "}
                            <a href="#" className="underline underline-offset-4">
                                Regístrate aquí
                            </a>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
