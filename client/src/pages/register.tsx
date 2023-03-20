import InputGroup from "../components/InputGroup";
import Link from "next/link";
import React, { FormEvent, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useAuthState } from "@/context/auth";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const [nick, setNick] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<any>({});
  const { authenticated } = useAuthState();

  let router = useRouter();

  if (authenticated) router.push("/");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault(); // 기본 동작인 페이지 리프레시 막음
    try {
      const res = await axios.post(
        // "/auth/register"
        "/auth/join",
        {
          email,
          nick,
          password,
          phoneNum,
        }
      );

      console.log("res", res);
      router.push("/login");
    } catch (e: any) {
      console.log("error : ", e);
      setErrors(e.response.data || {});
    }
  };

  return (
    <div className="bg-white">
      <div className="flex flex-col items-center justify-center h-screen p-6">
        <div className="w-10/12 mx-auto md:w-96">
          <h1 className="mb-2 text-lg font-medium">회원가입</h1>
          <form onSubmit={handleSubmit}>
            <InputGroup
              placeholder="Email"
              value={email}
              setValue={setEmail}
              error={errors.email}
            />
            <InputGroup
              placeholder="Nickname"
              value={nick}
              setValue={setNick}
              error={errors.nick}
            />
            <InputGroup
              placeholder="Password"
              value={password}
              setValue={setPassword}
              error={errors.password}
            />
            <InputGroup
              placeholder="PhoneNumber"
              value={phoneNum}
              setValue={setPhoneNum}
              error={errors.phoneNum}
            />
            <button className="w-full py-2 mb-1 text-xs font-bold text-white uppercase bg-gray-400 border border-gray-400 rounded">
              회원 가입
            </button>
          </form>
          <small>
            이미 가입하셨나요?
            <Link href="/login" legacyBehavior>
              <a className="ml-1 text-blue-500 uppercase">로그인</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Register;
