import React from "react";
import styled from "styled-components";
export default function PrivacyPoilcy() {
  return (
    <div>
      <PrivacyCtr>
        <h3>FRATY – Privacy Policy</h3>

        <span>
          This Privacy Policy outlines the types of personal data we collect
          from users, how we use it, and how we protect it. We collect and store
          the following types of personal data when users sign up with their
          mobile number:
          <ul>
            <li> Phone Number</li>
            <li> Name </li>
            <li> Pictures and messages uploaded by users</li>
            <li> Activity on our app </li>
            <li> Location data</li>
          </ul>
          We use this data to provide our services, improve our services, and to
          personalize the user experience. We may also use this data for
          marketing and advertising purposes. We will never sell or otherwise
          share this data with 3rd party platforms without the user’s explicit
          consent. We use appropriate technical, administrative, and physical
          security measures to protect the personal data we collect and store.
          This includes access controls, and regular monitoring and testing of
          our systems and services. We will only retain user data for as long as
          it is necessary to provide our services, or as otherwise required by
          law. We will provide users with access and the ability to update or
          delete their personal data, when requested. We might use the
          information we hold to send you marketing communications, communicate
          with you about our product, and inform you about our policies and
          terms. When you contact us, we also use your information to respond to
          you. We may use cookies to track user activity and to better
          understand how our users interact with the services we provide. We may
          use third-party services such as Google Analytics to provide us with
          information about our users. All such third-party services are subject
          to their own privacy policies. If you have any questions or concerns
          regarding our Privacy Policy, please contact us at
          fratyofficial@gmail.com.
        </span>
      </PrivacyCtr>
    </div>
  );
}

const PrivacyCtr = styled.div`
  h3 {
    display: flex;
    justify-content: center;
    align-items: center;
    font-style: bold;
  }
  p {
    font-size: 18px;
    text-align: justify;
  }
`;
