import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useGlobalState } from "../../context/global.context";
import { mixins } from "../../styles/global.theme";

const FaQ = () => {
  const { setCurrentPageTitle } = useGlobalState();
  const { state: faq } = useLocation();
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!faq) {
      navigate("/");
    }
    setCurrentPageTitle("FAQ");
  }, [setCurrentPageTitle]);

  return (
    <FaQCtr>
      {faq?.map((qna, idx) => {
        return (
          <div className="qna" key={idx + qna.question}>
            <p
              className="_ques"
              style={
                parseInt(idx) % 5 === 0
                  ? { background: "var(--color-orange)" }
                  : parseInt(idx) % 5 >= 4
                  ? { background: "var(--color-purple)" }
                  : parseInt(idx) % 5 >= 3
                  ? { background: "var(--color-blue)" }
                  : parseInt(idx) % 5 >= 2
                  ? { background: "var(--color-yellow)" }
                  : { background: "var(--color-green)" }
              }
            >
              {idx + 1}
              {". "}
              {qna?.question}
            </p>
            <p className="_ans">{qna?.answer}</p>
          </div>
        );
      })}
    </FaQCtr>
  );
};

const FaQCtr = styled.div`
  ${mixins.flexCol}
  gap:1rem;
  .qna {
    border: 1px solid var(--color-primary);
    border-radius: 1rem;
    overflow: hidden;
    ._ques {
      padding: 1rem;
      font-size: var(--fs-r2);
    }
    ._ans {
      padding: 1rem;
      font-size: var(--fs-s);
    }
  }
`;

export default FaQ;
