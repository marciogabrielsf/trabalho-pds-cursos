"use client";
import React, { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { LoginFormData, LoginFormProps } from "@/types/auth";
import { ArrowRight } from "lucide-react";

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading = false }) => {
    const [formData, setFormData] = useState<LoginFormData>({
        email: "",
        senha: "",
        lembrarDeMin: false,
    });

    const [errors, setErrors] = useState<Partial<LoginFormData>>({});

    const validateForm = (): boolean => {
        const newErrors: Partial<LoginFormData> = {};

        if (!formData.email) {
            newErrors.email = "Email é obrigatório";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email inválido";
        }

        if (!formData.senha) {
            newErrors.senha = "Senha é obrigatória";
        } else if (formData.senha.length < 6) {
            newErrors.senha = "Senha deve ter pelo menos 6 caracteres";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            onSubmit(formData);
        }
    };

    const handleInputChange =
        (field: keyof LoginFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;

            setFormData((prev) => ({
                ...prev,
                [field]: value,
            }));

            // Limpar erro quando o usuário começar a digitar
            if (errors[field]) {
                setErrors((prev) => ({
                    ...prev,
                    [field]: undefined,
                }));
            }
        };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <Input
                    type="email"
                    placeholder="Nome de usuário ou endereço de e-mail"
                    value={formData.email}
                    onChange={handleInputChange("email")}
                    error={errors.email}
                    autoComplete="email"
                />
            </div>

            <div>
                <Input
                    type="password"
                    placeholder="Senha"
                    value={formData.senha}
                    onChange={handleInputChange("senha")}
                    error={errors.senha}
                    autoComplete="current-password"
                />
            </div>

            <div className="flex items-center justify-between">
                {/* <div>
                    <Checkbox
                        label="Lembre de mim"
                        checked={formData.lembrarDeMin}
                        onChange={handleInputChange("lembrarDeMin")}
                    />
                </div> */}

                <div>
                    <Button type="submit" isLoading={isLoading}>
                        ENTRAR
                        <ArrowRight />
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default LoginForm;
