import InputGroup from "../components/InputGroup";
import Link from "next/link";
import React, { FormEvent, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useAuthDispatch, useAuthState } from "@/context/auth";

const Login = () => {
  let router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<any>({});
  const { authenticated } = useAuthState();

  if (authenticated) router.push("/");

  const dispatch = useAuthDispatch();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const res = await axios.post(
        "/auth/login",
        { email, password },
        { withCredentials: true }
      );

      console.log(res.data);

      dispatch("LOGIN", res.data?.loginUser);
      router.push("/");
    } catch (e: any) {
      console.log(e);
      setErrors(e.response.data || {});
    }
  };

  return (
    <div className="bg-white">
      <div className="flex flex-col items-center justify-center h-screen p-6">
        <div className="w-10/12 mx-auto md:w-96">
          <h1 className="mb-2 text-lg font-medium">로그인</h1>
          <form onSubmit={handleSubmit}>
            <InputGroup
              placeholder="Email"
              value={email}
              setValue={setEmail}
              error={errors.password}
            />
            <InputGroup
              placeholder="Password"
              value={password}
              setValue={setPassword}
              error={errors.password}
            />
            <button className="w-full py-2 mb-1 text-xs font-bold text-white uppercase bg-gray-400 border border-gray-400 rounded">
              로그인
            </button>
          </form>
          <small>
            아직 회원이 아닌가요?
            <Link href="/register" legacyBehavior>
              <a className="ml-1 text-blue-500 uppercase">회원가입</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;
