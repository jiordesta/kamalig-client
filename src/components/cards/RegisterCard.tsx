import { useState } from "react";
import type { UserRegistrationData } from "../../libs/types";
import TextInput from "../inputs/TextInput";

type RegisterCardProps = {
  handleNavigate: () => void;
  handleRegister: (form: UserRegistrationData | any) => void;
  isLoading: boolean;
};

export const RegisterCard = ({
  handleNavigate,
  handleRegister,
  isLoading,
}: RegisterCardProps) => {
  const [form, setForm] = useState<UserRegistrationData>();

  return (
    <div className="w-full">
      <div className="rounded-lg">
        <h1 className="font-bold text-start text-2xl tracking-widest">
          REGISTER
        </h1>
      </div>
      <form className="flex flex-col gap-2">
        <TextInput
          label="username"
          placeholder="Username"
          value={form}
          setter={setForm}
          dkey={"username"}
        />
        <TextInput
          label="password"
          placeholder="Password"
          type="password"
          value={form}
          setter={setForm}
          dkey={"password"}
        />
        <TextInput
          label="firstname"
          placeholder="First name"
          type="text"
          value={form}
          setter={setForm}
          dkey={"fname"}
        />
        <TextInput
          label="lastname"
          placeholder="Last name"
          type="text"
          value={form}
          setter={setForm}
          dkey={"lname"}
        />
      </form>

      <div className="pt-6">
        <button
          className="bg-highlight/50 hover:bg-highlight/75 w-full p-1 rounded-lg drop-shadow-2xl tracking-widest cursor-pointer"
          disabled={isLoading}
          onClick={() => handleRegister(form)}
        >
          REGISTER
        </button>

        <button
          className="underline w-full text-center text-[12px] pt-4 cursor-pointer"
          disabled={isLoading}
          onClick={() => handleNavigate()}
        >
          already have an account
        </button>
      </div>
    </div>
  );
};
