interface IMailConfig {
  driver: "ses";
  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: "ses",
  defaults: {
    from: {
      email: "support@digitalbankapi.net",
      name: "Digital Bank",
    },
  },
} as IMailConfig;
